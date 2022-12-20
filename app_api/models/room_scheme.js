const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        unique: true,
        required: true,
        min: 1
    },
    roomType: {
        type: mongoose.Schema.ObjectId,
        ref: 'roomType',
        required: true
    },
    floor: {
        type: String,
        enum: ['Planta Baja','Primer Piso','Segundo Piso'],
        required: true
    },
});

/* Creating a new model called `room` with the schema `roomSchema` and the collection `rooms` */
const Room = new mongoose.model('room', roomSchema,'rooms');

/*const rm = new Room({
     roomNumber: 1,
     roomType: '6370fe6f21cef5e34cc5f881',
     floor: 'Planta Baja'
 });

rm.save();*/