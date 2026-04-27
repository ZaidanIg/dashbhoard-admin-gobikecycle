const supabase = require('../helpers/supabase');
const responseHelper = require('../helpers/response');
const { v4: uuidv4 } = require('uuid');

const mobileHandler = {
  // ... previous methods ...

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
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data, 'Bookings retrieved successfully');
    } catch (err) {
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

      // 2. Calculate Total (Simplified addon logic for now)
      // Addon prices (could be fetched from a table, but for now hardcoded to match Flutter)
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

      // 3. Handle Balance Deduction
      if (paymentMethod === 'balance') {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', userId)
          .single();
        
        if (profileError || (profile.balance || 0) < totalPrice) {
          return responseHelper.error(h, 'Saldo tidak mencukupi', 400);
        }

        // Deduct Balance
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
