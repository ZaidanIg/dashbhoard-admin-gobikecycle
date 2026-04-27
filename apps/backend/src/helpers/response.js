const responseHelper = {
  success: (h, data, message = 'Success', code = 200) => {
    return h.response({
      status: 'success',
      message,
      data
    }).code(code);
  },

  error: (h, message = 'Internal Server Error', code = 500, errors = null) => {
    return h.response({
      status: 'error',
      message,
      errors
    }).code(code);
  }
};

module.exports = responseHelper;
