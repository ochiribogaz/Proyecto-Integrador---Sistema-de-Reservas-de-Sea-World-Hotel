const mongoose = require('mongoose');
const roomTypes = mongoose.model('roomType');

/* It creates a roomType in the database. */
const createRoomTypeType = (req, res) => {
    roomTypes.create(
        {
            roomCategory: req.body.roomCategory,
            roomSize: req.body.roomSize,
            amenities: req.body.amenities,
            price: req.body.price,
            capacity: req.body.capacity,
            imageUrl: req.body.imageUrl
        },
        (err, roomTypeResult) => {
        if (err) {
            return res
                .status(400)
                .json({'error':err});
        } else {
            return res
                .status(201)
                .json(roomTypeResult);
        }
    });
}

/* It returns a list of roomTypes from the database. */
const roomTypeTypeList = (req, res) => {
    roomTypes
        .find()
        .exec((err,roomTypeResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!roomTypeResult || roomTypeResult.length == 0){
                return res
                    .status(404)
                    .json({'result':'No se han encontrado documentos en la colección habitaciones'});
            }
            res
                .status(200)
                .json(roomTypeResult);
        });
};

/* It gets the roomTypeid from the URL parameters, then it looks for the roomType in the database and returns it. */
const readRoomTypeType = (req, res) => {
    roomTypes
        .findById(req.params.roomTypeid) /* Getting the roomTypeid from the URL parameters. */
        .exec((err,roomTypeResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!roomTypeResult){
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado la habitación con id ${req.params.roomTypeid}`});
            }
            res
                .status(200)
                .json(roomTypeResult);
        });
};

/* It takes the roomTypeid from the request, finds the roomType in the database, updates the roomType's information, and returns a token */
const updateRoomTypeType = (req, res) => {
    if (!req.params.roomTypeid) {
        return res
            .status(404)
            .json({'message':'Id de la Habitación no encontrado'});
    }
    roomTypes
        .findById(req.params.roomTypeid)
        .exec((err, roomTypeResult) => {
            if (!roomTypeResult) {
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado la habitación con id ${req.params.roomTypeid}`});
            } else if (err) {
                return res
                    .status(400)
                    .json({'error':err});
            }
            
            roomTypeResult.roomCategory = req.body.roomCategory?req.body.roomCategory:roomTypeResult.roomCategory;
            roomTypeResult.roomSize = req.body.roomSize?req.body.roomSize:roomTypeResult.roomSize;
            roomTypeResult.amenities = req.body.amenities?req.body.amenities:roomTypeResult.amenities;
            roomTypeResult.price = req.body.price?req.body.price:roomTypeResult.price;
            roomTypeResult.capacity = req.body.capacity?req.body.capacity:roomTypeResult.capacity;
            roomTypeResult.imageUrl = req.body.imageUrl?req.body.imageUrl:roomTypeResult.imageUrl;
            roomTypeResult.save((err, roomTypes) => {
                if (err) {
                    res
                        .status(404)
                        .json({'error':err});
                } else {
                    res
                        .status(200)
                        .json(roomTypeResult);
                }
            })
        })
};


/* It deletes a roomType from the database based on the roomTypeid passed in the request. */
const deleteRoomType = (req, res) => {
    if(!req.params.roomTypeid){
        return res
            .status(404)
            .json({'message':'Id de la Habitación no encontrado'});
    }
    roomTypes
        .findByIdAndDelete(req.params.roomTypeid)
        .exec((err, roomTypeResult) => {
            if (roomTypeResult.deletedCount == 0) {
                return res
                    .status(404)
                    .json({'message': `No existe una habitación con id: ${req.params.roomTypeid}`});
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


module.exports = {
    roomTypeList: roomTypeTypeList,
    createRoomType: createRoomTypeType,
    readRoomType: readRoomTypeType,
    updateRoomType: updateRoomTypeType,
    deleteRoomType
}