const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
    roomCategory: {
        type: String,
        enum: ['Estándar','Lujo', 'Superior'],
        required: true
    },
    roomSize: {
        type: String,
        enum: ['Matrimonial','Triple', 'Cuádruple'],
        required: true
    },
    amenities: {
        type: [String],
        enum: ['Aire Acondicionado', 'Balcón', 'Ducha de agua caliente', 'TV por cable', 'Teléfono interno', 'Cama doble', 'Cama litera de plaza y media', 'Cama de plaza y media'],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    capacity: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
});

/* Creating a new model called RoomType, which is based on the roomTypeSchema. */
const RoomType = new mongoose.model('roomType', roomTypeSchema,'roomTypes');


 /*const rmt = new RoomType({
    price: 15.00,
    roomCategory: 'Estándar',
    roomSize: 'Matrimonial',
    amenities: ['Aire Acondicionado', 'Balcón', 'Ducha de agua caliente', 'TV por cable'],
    capacity: 3
 });

rmt.save();*/