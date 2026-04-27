const supabase = require('../helpers/supabase');
const responseHelper = require('../helpers/response');

const mobileHandler = {
  getBicycles: async (request, h) => {
    try {
      const { data, error } = await supabase
        .from('bicycles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data, 'Bicycles retrieved successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  getProfile: async (request, h) => {
    try {
      const { userId } = request.params;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data, 'Profile retrieved successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  getBookings: async (request, h) => {
    try {
      const { userId } = request.params;
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          bicycle:bicycles ( name )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data, 'Bookings retrieved successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  completeBooking: async (request, h) => {
    try {
      const { bookingId, bikeId } = request.payload;
      console.log(`Completing booking: ${bookingId} for bike: ${bikeId}`);

      // 1. Check if booking exists
      const { data: booking, error: findError } = await supabase
        .from('bookings')
        .select('id')
        .eq('id', bookingId)
        .single();
      
      if (findError || !booking) {
        console.error(`Booking not found: ${bookingId}`);
        return responseHelper.error(h, 'Data pesanan tidak ditemukan', 404);
      }

      // 2. Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', bookingId);
      
      if (bookingError) {
        console.error(`Error updating booking: ${bookingError.message}`);
        return responseHelper.error(h, bookingError.message);
      }

      // 3. Make bike available again
      await supabase
        .from('bicycles')
        .update({ is_available: true })
        .eq('id', bikeId);

      console.log(`Booking ${bookingId} completed successfully`);
      return responseHelper.success(h, null, 'Booking completed successfully');
    } catch (err) {
      console.error(`Catch error in completeBooking: ${err.message}`);
      return responseHelper.error(h, err.message);
    }
  },

  checkout: async (request, h) => {
    try {
      const { bikeId, userId, addons, durationHours, paymentMethod } = request.payload;

      // 1. Validate Bike
      const { data: bike, error: bikeError } = await supabase
        .from('bicycles')
        .select('*')
        .eq('id', bikeId)
        .single();
      
      if (bikeError || !bike.is_available) {
        return responseHelper.error(h, 'Sepeda tidak tersedia atau tidak ditemukan', 400);
      }

      // 2. Calculate Total
      const addonPrices = {
        'seragam': 5000,
        'safety': 3000,
        'rain_jacket': 4000,
        'water_bottle': 2000,
      };

      let addonTotal = 0;
      Object.keys(addons).forEach(key => {
        addonTotal += (addons[key] || 0) * (addonPrices[key] || 0);
      });

      const totalPrice = (bike.price_per_hour + addonTotal) * durationHours;

      // 3. Handle Balance
      if (paymentMethod === 'balance') {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', userId)
          .single();
        
        if (profileError || (profile.balance || 0) < totalPrice) {
          return responseHelper.error(h, 'Saldo tidak mencukupi', 400);
        }

        await supabase
          .from('profiles')
          .update({ balance: profile.balance - totalPrice })
          .eq('id', userId);
      }

      // 4. Create Booking
      const bookingCode = `GB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_id: userId,
          bicycle_id: bikeId,
          status: 'active',
          total_price: totalPrice,
          booking_code: bookingCode,
          duration_hours: durationHours,
          payment_method: paymentMethod,
          addons: addons
        }])
        .select()
        .single();
      
      if (bookingError) return responseHelper.error(h, bookingError.message);

      // 5. Mark Bike as Unavailable
      await supabase
        .from('bicycles')
        .update({ is_available: false })
        .eq('id', bikeId);

      return responseHelper.success(h, {
        booking_id: booking.id,
        booking_code: bookingCode,
        total_price: totalPrice,
        status: 'active'
      }, 'Checkout successful');

    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  }
};

module.exports = mobileHandler;
