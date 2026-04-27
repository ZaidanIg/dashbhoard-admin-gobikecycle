const supabase = require('../helpers/supabase');
const responseHelper = require('../helpers/response');

const bicycleHandler = {
  getAll: async (request, h) => {
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

  create: async (request, h) => {
    try {
      const { name, type, price_per_hour, is_available, last_lat, last_long } = request.payload;
      const { data, error } = await supabase
        .from('bicycles')
        .insert([{ name, type, price_per_hour, is_available, last_lat, last_long }])
        .select();
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data[0], 'Bicycle created successfully', 201);
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  update: async (request, h) => {
    try {
      const { id } = request.params;
      const { name, type, price_per_hour, is_available, last_lat, last_long } = request.payload;
      
      const { data, error } = await supabase
        .from('bicycles')
        .update({ name, type, price_per_hour, is_available, last_lat, last_long })
        .eq('id', id)
        .select();
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data[0], 'Bicycle updated successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  delete: async (request, h) => {
    try {
      const { id } = request.params;
      const { error } = await supabase.from('bicycles').delete().eq('id', id);
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, null, 'Bicycle deleted successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  reactivate: async (request, h) => {
    try {
      const { id } = request.params;
      
      // 1. Force update bike status to available
      const { error: bikeError } = await supabase
        .from('bicycles')
        .update({ is_available: true })
        .eq('id', id);

      if (bikeError) return responseHelper.error(h, bikeError.message);

      // 2. Also cancel any active bookings for this bike to keep consistency
      await supabase
        .from('bookings')
        .update({ status: 'completed' }) // Or 'cancelled'
        .eq('bicycle_id', id)
        .eq('status', 'active');

      return responseHelper.success(h, null, 'Bicycle reactivated successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  }
};

module.exports = bicycleHandler;
