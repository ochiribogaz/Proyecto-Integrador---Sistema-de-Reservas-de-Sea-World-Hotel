const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true,
        min: function() { return this.checkIn; }
    },
    customer: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum: ['En progreso','Completada', 'Cancelada'],
    },
    type: {
        type: String,
        enum: ['En línea','Presencial'],
    },
    rooms: [{
        room: {
            type: Number,
            ref: 'room',
            required: true
        },
        numAdults: {
            type: Number,
            required: true,
            min: 1
        },
        numChildren: {
            type: Number,
            required: true,
            min: 0
        },
    }],
    paymentMethod: {
        type: String,
        enum: ['Efectivo','Payphone']
    },
    discountPercentage: {
        type: Number,
        'default': 0,
        min: 0,
        max: 100
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

/* Creating a new model called booking, using the bookingSchema and the collection bookings. */
const Booking = new mongoose.model('booking', bookingSchema,'bookings');
let date = new Date();
/*const bk = new Booking({
    checkIn: date.setDate(date.getDate() + 2),
    checkOut: date.setDate(date.getDate() + 3),
    customer: 1720544632,
    state: 'Completada',
    type: 'Presencial',
    rooms: [{
        room: 2,
        numAdults: 2,
        numChildren: 0
    }],
    paymentMethod: 'Efectivo',
    discountPercentage: 0,
    totalPrice: 30
});

bk.save();*/