const mongoose = require('mongoose');
const bookings = mongoose.model('booking');

/* It creates a booking in the database. */
const createBooking = (req, res) => {
    console.log('Creating Booking')
    bookings.create(
        {
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            customer: req.body.customer,
            state: req.body.state,
            type: req.body.type,
            rooms: req.body.rooms,
            paymentMethod: req.body.paymentMethod,
            discountPercentage: req.body.discountPercentage,
            totalPrice: req.body.totalPrice
        },
        (err, bookingResult) => {
        if (err) {
            console.log(err);
            return res
                .status(400)
                .json({'error':err});
        } else {
            return res
                .status(201)
                .json(bookingResult);
        }
    });
}

/* It returns a list of bookings from the database. */
const bookingList = (req, res) => {
    bookings
        .find()
        .exec((err,bookingResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!bookingResult || bookingResult.length == 0){
                return res
                    .status(404)
                    .json({'result':'No se han encontrado documentos en la colección habitaciones'});
            }
            return res
                .status(200)
                .json(bookingResult);
        });
};

/* It gets the bookingid from the URL parameters, then it looks for the booking in the database and returns it. */
const readBooking = (req, res) => {
    bookings
        .findById(req.params.bookingid) /* Getting the bookingid from the URL parameters. */
        .exec((err,bookingResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!bookingResult){
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado la reserva con id ${req.params.bookingid}`});
            }
            res
                .status(200)
                .json(bookingResult);
        });
};

/* It takes the bookingid from the request, finds the booking in the database, updates the booking's information, and returns a token */
const updateBooking = (req, res) => {
    if (!req.params.bookingid) {
        return res
            .status(404)
            .json({'message':'Id de la Reserva no encontrado'});
    }
    bookings
        .findById(req.params.bookingid)
        .exec((err, bookingResult) => {
            if (!bookingResult) {
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado la reserva con id ${req.params.bookingid}`});
            } else if (err) {
                return res
                    .status(400)
                    .json({'error':err});
            }

            bookingResult.checkIn = req.body.checkIn?req.body.checkIn:bookingResult.checkIn;
            bookingResult.checkOut = req.body.checkOut?req.body.checkOut:bookingResult.checkOut;
            bookingResult.customer = req.body.customer?req.body.customer:bookingResult.customer;
            bookingResult.state = req.body.state?req.body.state:bookingResult.state;
            bookingResult.type = req.body.type?req.body.type:bookingResult.type;
            bookingResult.rooms = req.body.rooms?req.body.rooms:bookingResult.rooms;
            bookingResult.paymentMethod = req.body.paymentMethod?req.body.paymentMethod:bookingResult.paymentMethod;
            bookingResult.discountPercentage = req.body.discountPercentage?req.body.discountPercentage:bookingResult.discountPercentage;
            bookingResult.totalPrice = req.body.totalPrice?req.body.totalPrice:bookingResult.totalPrice;


            bookingResult.save((err, bookings) => {
                if (err) {
                    res
                        .status(404)
                        .json({'error':err});
                } else {
                    res
                        .status(200)
                        .json(bookingResult);
                }
            })
        })
};


/* It deletes a booking from the database based on the bookingid passed in the request. */
const deleteBooking = (req, res) => {
    if(!req.params.bookingid){
        return res
            .status(404)
            .json({'message':'Id de la Reserva no encontrado'});
    }
    bookings
        .findByIdAndDelete(req.params.bookingid)
        .exec((err, bookingResult) => {
            if (bookingResult.deletedCount == 0) {
                return res
                    .status(404)
                    .json({'message': `No existe una reserva con id: ${req.params.bookingid}`});
                }
            else if (err) {
                return res
                    .status(404)
                    .json({'error':err});
                }
            return res
                .status(204)
                .send();
    });
};


/**
 * It finds all the bookings that have a checkIn or checkOut date between the checkIn and checkOut
 * dates passed as parameters.
 * @param req - The request object.
 * @param res - the response object
 */
const findBookingRoomsByDate = (req, res) => {
    const checkIn = new Date(new RegExp(req.params.checkIn));
    const checkOut = new Date(new RegExp(req.params.checkOut));
    bookings
        .find(
            {
                '$or': [
                    {
                        'checkIn': {
                            '$gte': checkIn,
                            '$lte': checkOut
                        }
                    },
                    {
                        'checkOut': {
                            '$gte': checkIn,
                            '$lte': checkOut
                        }
                    }
                ],
                'state': {'$eq': 'En progreso'}
            }
        )
        .select('rooms.room')
        .exec((err, ocuppiedRooms) => {
            if (!ocuppiedRooms || ocuppiedRooms.length == 0) { // find no encontro el documentos en la coleccion
                console.log(`No existen documentos con check in o check out entre el ${checkIn} y el ${checkOut}`);
                return res // respondo el mensaje en formato JSON y status HTTP 404
                    .status(404)
                    .json({
                        "message": `Reservas entre el ${checkIn} y el ${checkOut} no encontradas`
                    });
            } else if (err) { // find encontro un error
                console.log(`Se encontro un error en la coleccion ${reserva} con check in o check out entre el ${checkIn} y el ${checkOut}`);
                return res // respondo el error en formato JSON y status HTTP 404
                    .status(404)
                    .json(err);
            }
            console.log(`Se encontró el documento`);
            res // respondo los documentos encontrados en formato JSON y status HTTP 200
                .status(200)
                .json(ocuppiedRooms);
        });
};

module.exports = {
    bookingList,
    createBooking,
    readBooking,
    updateBooking,
    deleteBooking,
    findBookingRoomsByDate
}