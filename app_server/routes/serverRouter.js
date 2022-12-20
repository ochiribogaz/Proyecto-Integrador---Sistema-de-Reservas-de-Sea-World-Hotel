const express = require('express');
const router = express.Router();

/* CONTROLLERS IMPORTS */
const indexController = require('../controllers/index');
const historyController = require('../controllers/history');
const galleryController = require('../controllers/gallery');
const bookingController = require('../controllers/book');

/* ROUTES */
router.get('/', indexController.renderIndex);
router.get('/inicio', indexController.renderIndex);
router.get('/historia', historyController.renderHistory);
router.get('/galeria', galleryController.renderGallery);
router.get('/BookingAdmin/Reservar', bookingController.renderBook);

module.exports = router;
