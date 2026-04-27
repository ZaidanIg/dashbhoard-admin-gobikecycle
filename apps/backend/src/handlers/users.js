const supabase = require('../helpers/supabase');
const responseHelper = require('../helpers/response');

const userHandler = {
  getAll: async (request, h) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data, 'Users retrieved successfully');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  },

  topUp: async (request, h) => {
    try {
      const { id } = request.params;
      const { amount } = request.payload;
      
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', id)
        .single();
      
      if (fetchError) return responseHelper.error(h, fetchError.message);
      
      const newBalance = (profile.balance || 0) + amount;
      const { data, error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', id)
        .select();
      
      if (error) return responseHelper.error(h, error.message);
      return responseHelper.success(h, data[0], 'Top up successful');
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  }
};

module.exports = userHandler;
