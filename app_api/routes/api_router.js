const express = require('express');
const router = express.Router();
const {expressjwt: expressjwt} = require('express-jwt');


// 'auth' is middleware that validates the supplied JWT extracts the payload data
const auth = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload', // this will add the JWT's payload data to req.payload
    // the token is sent in the http request as the 'Authorization' header with the value of 'Bearer {token}'
    algorithms: ["HS256"]
});

/* Importing the controllers from the controllers folder. */
const bookingsCtrl = require('../controllers/bookings');
const customersCtrl = require('../controllers/customers');
const roomsCtrl = require('../controllers/rooms');
const roomTypesCtrl = require('../controllers/roomTypes');
const usersCtrl = require('../controllers/users');
const ctrlAuth = require("../controllers/authentication"); 
const customerBookingCtrl = require("../controllers/customerBooking");

/* This is the route that will be used to authenticate the user. */
router.post('/login', ctrlAuth.login);
router.put('/forgotPassword', ctrlAuth.forgotPassword);
router.put('/resetPassword/:token', ctrlAuth.resetPassword);

/* This is a route that will be used to create a booking and get a list of bookings. */

router
    .route('/bookings')
    .post(auth,bookingsCtrl.createBooking)
    .get(auth, bookingsCtrl.bookingList);


/* This is a route that will be used to get, update and delete a booking. */
router
    .route('/bookings/:bookingid')
    .get(auth, bookingsCtrl.readBooking)
    .put(auth, bookingsCtrl.updateBooking)
    .delete(auth, bookingsCtrl.deleteBooking);

router
    .route("/occupiedRooms/:checkIn/:checkOut")
    .get(bookingsCtrl.findBookingRoomsByDate);

/* This is a route that will be used to create a customer and get a list of customers. */
router
    .route('/customers')
    .post(customersCtrl.createCustomer)
    .get(auth,customersCtrl.customerList);


/* This is a route that will be used to get, update and delete a customer. */
router
    .route('/customers/:customerid')
    .get(auth, customersCtrl.readCustomer)
    .put(customersCtrl.updateCustomer)
    .delete(auth, customersCtrl.deleteCustomer);


/* This is a route that will be used to create a room and get a list of rooms. */
router
    .route('/rooms')
    .post(auth, roomsCtrl.createRoom)
    .get(roomsCtrl.roomList);


/* This is a route that will be used to get, update and delete a room. */
router
    .route('/rooms/:roomid')
    .get(auth, roomsCtrl.readRoom)
    .put(auth, roomsCtrl.updateRoom)
    .delete(auth, roomsCtrl.deleteRoom);

/* This is a route that will be used to get a room with all the details. */
router
    .route('/completeRoom/:roomid')
    .get(roomsCtrl.readCompleteRoom)

/* This is a route that will be used to create a roomType and get a list of roomTypes. */
router
    .route('/roomTypes')
    .post(auth, roomTypesCtrl.createRoomType)
    .get(roomTypesCtrl.roomTypeList);


/* This is a route that will be used to get, update and delete a roomType. */
router
    .route('/roomTypes/:roomTypeid')
    .get(roomTypesCtrl.readRoomType)
    .put(auth, roomTypesCtrl.updateRoomType)
    .delete(auth, roomTypesCtrl.deleteRoomType);

/* This is a route that will be used to create a user and get a list of users. */
router
    .route('/users')
    .post(auth, usersCtrl.createUser)
    .get(auth, usersCtrl.userList);


/* This is a route that will be used to get, update and delete a user. */
router
    .route('/users/:userid')
    .get(auth, usersCtrl.readUser)
    .put(auth, usersCtrl.updateUser)
    .delete(auth, usersCtrl.deleteUser);

/* This is a route that will be used to create a customer and a booking. */
router
    .route('/customerBooking')
    .post(customerBookingCtrl.manageCustomerAndBooking);

module.exports = router;