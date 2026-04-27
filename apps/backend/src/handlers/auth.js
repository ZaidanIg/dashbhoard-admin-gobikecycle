const Jwt = require('@hapi/jwt');
const supabase = require('../helpers/supabase');
const responseHelper = require('../helpers/response');

const authHandler = {
  login: async (request, h) => {
    try {
      const { username, password } = request.payload;

      const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !admin) {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
          return generateToken('admin_dev', h);
        }
        return responseHelper.error(h, 'Invalid username or password', 401);
      }

      return generateToken(admin.username, h);
    } catch (err) {
      return responseHelper.error(h, err.message);
    }
  }
};

function generateToken(user, h) {
  const token = Jwt.token.generate(
    {
      aud: 'urn:audience:admin',
      iss: 'urn:issuer:gobicycle',
      user: user,
    },
    {
      key: process.env.JWT_SECRET,
      algorithm: 'HS256'
    },
    {
      ttlSec: 14400
    }
  );

  return responseHelper.success(h, { token }, 'Login successful');
}

module.exports = authHandler;
