const authHandler = require('../handlers/auth');
const bicycleHandler = require('../handlers/bicycles');
const userHandler = require('../handlers/users');
const bookingHandler = require('../handlers/bookings');
const mobileRoutes = require('./mobile');

const adminRoutes = [
  // Auth
  {
    method: 'POST',
    path: '/api/admin/login',
    options: { auth: false },
    handler: authHandler.login
  },

  // Bicycles (Admin)
  {
    method: 'GET',
    path: '/api/bicycles',
    handler: bicycleHandler.getAll
  },
  {
    method: 'POST',
    path: '/api/bicycles',
    handler: bicycleHandler.create
  },
  {
    method: 'PUT',
    path: '/api/bicycles/{id}',
    handler: bicycleHandler.update
  },
  {
    method: 'DELETE',
    path: '/api/bicycles/{id}',
    handler: bicycleHandler.delete
  },
  {
    method: 'POST',
    path: '/api/bicycles/{id}/reactivate',
    options: { auth: false },
    handler: bicycleHandler.reactivate
  },

  // Users (Admin)
  {
    method: 'GET',
    path: '/api/users',
    handler: userHandler.getAll
  },
  {
    method: 'PUT',
    path: '/api/users/{id}/balance',
    handler: userHandler.topUp
  },

  // Bookings (Admin)
  {
    method: 'GET',
    path: '/api/bookings',
    handler: bookingHandler.getAll
  }
];

module.exports = [...adminRoutes, ...mobileRoutes];
