const mongoose = require('mongoose');
const rooms = mongoose.model('room');

/* It creates a room in the database. */
const createRoom = (req, res) => {
    rooms.create(
        {
            roomNumber: req.body.roomNumber,
            roomType: req.body.roomType,
            floor: req.body.floor
        },
        (err, roomResult) => {
        if (err) {
            return res
                .status(400)
                .json({'error':err});
        } else {
            return res
                .status(201)
                .json(roomResult);
        }
    });
}

/* It returns a list of rooms from the database. */
const roomList = (req, res) => {
    rooms
        .aggregate(
            [{
                "$lookup": {
                    "from": "roomTypes",
                    "localField": "roomType",
                    "foreignField": "_id",
                    "as": "roomType"
                }
            },
        ])
        .exec((err,roomResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!roomResult || roomResult.length == 0){
                return res
                    .status(404)
                    .json({'result':'No se han encontrado documentos en la colección habitaciones'});
            }
            res
                .status(200)
                .json(roomResult);
        });
};

/* It gets the roomid from the URL parameters, then it looks for the room in the database and returns it. */
const readRoom = (req, res) => {
    rooms
        .findById(req.params.roomid) /* Getting the roomid from the URL parameters. */
        .exec((err,roomResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!roomResult){
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado la habitación con id ${req.params.roomid}`});
            }
            res
                .status(200)
                .json(roomResult);
        });
};

/* It gets the roomid from the URL parameters, then it looks for the room with it's room type information in the database and returns it. */
const readCompleteRoom = (req, res) => {
    rooms
        .aggregate(
            [
                {'$match': {'_id': mongoose.Types.ObjectId(req.params.roomid)}},
                {
                "$lookup": {
                    "from": "roomTypes",
                    "localField": "roomType",
                    "foreignField": "_id",
                    "as": "roomType"
                }
            }
        ])
        .exec((err,roomResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!roomResult || roomResult.length == 0){
                return res
                    .status(404)
                    .json({'result':'No se han encontrado documentos en la colección habitaciones'});
            }
            res
                .status(200)
                .json(roomResult[0]);
        });
};

/* It takes the roomid from the request, finds the room in the database, updates the room's information, and returns a token */
const updateRoom = (req, res) => {
    if (!req.params.roomid) {
        return res
            .status(404)
            .json({'message':'Id de la Habitación no encontrado'});
    }
    rooms
        .findById(req.params.roomid)
        .exec((err, roomResult) => {
            if (!roomResult) {
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado la habitación con id ${req.params.roomid}`});
            } else if (err) {
                return res
                    .status(400)
                    .json({'error':err});
            }

            roomResult.roomNumber = req.body.roomNumber?req.body.roomNumber:roomResult.roomNumber;
            roomResult.roomType = req.body.roomType?req.body.roomType:roomResult.roomType;
            roomResult.floor = req.body.floor?req.body.floor:roomResult.floor;

            roomResult.save((err, rooms) => {
                if (err) {
                    res
                        .status(404)
                        .json({'error':err});
                } else {
                    res
                        .status(200)
                        .json(roomResult);
                }
            })
        })
};


/* It deletes a room from the database based on the roomid passed in the request. */
const deleteRoom = (req, res) => {
    if(!req.params.roomid){
        return res
            .status(404)
            .json({'message':'Id de la Habitación no encontrado'});
    }
    rooms
        .deleteOne({"_id": req.params.roomid})
        .exec((err, roomResult) => {
            if (!roomResult) {
                return res
                    .status(404)
                    .json({'message': `No existe una habitación con id: ${req.params.roomid}`});
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
    roomList,
    createRoom,
    readRoom,
    readCompleteRoom,
    updateRoom,
    deleteRoom
}