const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        enum: ['Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Sto. Domingo Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'],
        required: true
    },
});

/* Creating a new model called customer, using the customerSchema and the collection customers. */
const Customer = new mongoose.model('customer', customerSchema,'customers');

/* const cm = new Customer({
    customerId: 1720544632,
    name: 'Ali',
    lastname: 'Zambrano',
    phone: 2078566,
    email: 'smartosenz@gmail.com',
    address: 'La Armenia',
    province: 'Pichincha'
});

cm.save();*/