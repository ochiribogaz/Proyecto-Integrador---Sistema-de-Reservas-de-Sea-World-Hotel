const mongoose = require('mongoose');
const customers = mongoose.model('customer');
const bookings = mongoose.model('booking');
const database = require('../models/database');

const transactionOptions = {
	readPreference: 'primary',
	readConcern: {level: 'local'},
	writeConcern: {w: 'majority'}
}


const manageCustomerAndBooking = async (req, res) => {
    console.log('customerBooking');
    const registeredCustomer = await customers.findOne({'customerId': req.body.customerId});
    let requestError = null;
    const bookingCustomer = {
        customerId: req.body.customerId,
        name: req.body.name,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        province: req.body.province
    };
    const booking = {
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        customer: req.body.customer,
        state: req.body.state,
        type: req.body.type,
        rooms: req.body.rooms,
        paymentMethod: req.body.paymentMethod,
        discountPercentage: req.body.discountPercentage,
        totalPrice: req.body.totalPrice
    };


    if(!registeredCustomer){
        try {
            await customers.create(bookingCustomer);  
        } catch (error) {
            requestError = error;
        }
        console.log('El error de API es', requestError);
        if(requestError){
            return res
                .status(404)
                .json({'error':requestError});
        }

    }
    else{
        console.log('Update');
        try {
            registeredCustomer.customerId = bookingCustomer.customerId;
            registeredCustomer.name = bookingCustomer.name;
            registeredCustomer.lastname = bookingCustomer.lastname;
            registeredCustomer.phone = bookingCustomer.phone;
            registeredCustomer.email = bookingCustomer.email;
            registeredCustomer.address = bookingCustomer.address;
            registeredCustomer.province = bookingCustomer.province;
            await registeredCustomer.save();
        } catch (error) {
            requestError = error;
        }
        console.log('El error de API es', requestError);
        if(requestError){
            return res
                .status(404)
                .json({'error':requestError});
        }
    }

    try {
        await bookings.create(booking);
    } catch (error) {
        requestError = error;
    }

    if(requestError){
        if(!registeredCustomer){
            await customers.deleteOne({'customerId': req.body.customerId});
        }
        console.log('El error de API es', requestError);
        return res
            .status(404)
            .json({'error':requestError});
    }

    return res
        .status(201)
        .json({bookingCustomer,booking});
}


module.exports = {
    manageCustomerAndBooking
}