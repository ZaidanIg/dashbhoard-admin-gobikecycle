const supabase = require('../helpers/supabase');
const responseHelper = require('../helpers/response');

const bookingHandler = {
  getAll: async (request, h) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          bicycle:bicycles ( name ),
          profile:profiles ( full_name )
        `)
        .order('created_at', { ascending: false });
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data, 'Bookings retrieved successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  }
};

module.exports = bookingHandler;
