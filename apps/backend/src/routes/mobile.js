const mobileHandler = require('../handlers/mobile');

const mobileRoutes = [
  {
    method: 'GET',
    path: '/api/mobile/bicycles',
    options: { auth: false }, // Accessible by mobile app
    handler: mobileHandler.getBicycles
  },
  {
    method: 'GET',
    path: '/api/mobile/profiles/{userId}',
    options: { auth: false },
    handler: mobileHandler.getProfile
  },
  {
    method: 'GET',
    path: '/api/mobile/bookings/{userId}',
    options: { auth: false },
    handler: mobileHandler.getBookings
  },
  {
    method: 'POST',
    path: '/api/mobile/rental/complete',
    options: { auth: false },
    handler: mobileHandler.completeBooking
  },
  {
    method: 'POST',
    path: '/api/mobile/checkout',
    options: { auth: false },
    handler: mobileHandler.checkout
  }
];

module.exports = mobileRoutes;
