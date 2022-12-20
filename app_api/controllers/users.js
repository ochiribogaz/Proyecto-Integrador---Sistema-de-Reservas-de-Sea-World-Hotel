const mongoose = require('mongoose');
const users = mongoose.model('user');
const mailManager = require('./mail-manager')


/* It creates a user in the database. */
const createUser = async(req, res) => {
    console.log('createUser');
    const user = new users({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        role: req.body.role
    });
    const password = req.body.password?req.body.password:user.generatePassword();
    user.setPassword(password);

    try {
        mail = mailManager.createNewUserEmail(user, password);
        mailManager.transporter.sendMail(mail);
    } catch (error) {
        console.log("No se envió el mail");
        console.log(err);
    }

    user.save((err, userResult) => {
        if (err) {
            return res
                .status(400)
                .json({'error':err});
        } else {
            return res
                .status(201)
                .json(userResult);
        }
    });
}

/* It returns a list of users from the database. */
const userList = (req, res) => {
    users
        .find()
        .exec((err,userResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!userResult || userResult.length == 0){
                return res
                    .status(404)
                    .json({'result':'No se han encontrado documentos en la colección usuarios'});
            }
            res
                .status(200)
                .json(userResult);
        });
};

/* It gets the userid from the URL parameters, then it looks for the user in the database and returns it. */
const readUser = (req, res) => {
    users
        .findById(req.params.userid) /* Getting the userid from the URL parameters. */
        .exec((err,userResult) =>{
            if(err){
                return res
                    .status(404)
                    .json({'error': err});
            }
            else if(!userResult){
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado el usuario con id ${req.params.userid}`});
            }
            res
                .status(200)
                .json(userResult);
        });
};

/* It takes the userid from the request, finds the user in the database, updates the user's information, and returns a token */
const updateUser = (req, res) => {
    if (!req.params.userid) {
        return res
            .status(404)
            .json({'message':'Id del Usuario no encontrado'});
    }
    users
        .findById(req.params.userid)
        .exec((err, userResult) => {
            if (!userResult) {
                return res
                    .status(404)
                    .json({'message':`No se ha encontrado el usuario con id ${req.params.userid}`});
            } else if (err) {
                return res
                    .status(400)
                    .json({'error':err});
            }

            userResult.name = req.body.name?req.body.name:userResult.name;
            userResult.lastname = req.body.lastname?req.body.lastname:userResult.lastname;
            userResult.email = req.body.email?req.body.email:userResult.email;
            userResult.role = req.body.role?req.body.role:userResult.role;

            if(req.body.password){
                userResult.setPassword(req.body.password);
            }

            userResult.save((err, users) => {
                if (err) {
                    res
                        .status(404)
                        .json({'error':err});
                } else {
                    res
                        .status(200)
                        .json(userResult);
                }
            })
        });
};


/* It deletes a user from the database based on the userid passed in the request. */
const deleteUser = (req, res) => {
    if(!req.params.userid){
        return res
            .status(404)
            .json({'message':'Id del Usuario no encontrado'});
    }
    console.log('Deleting')
    users
        .deleteOne({email: req.params.userid})
        .exec((err, userResult) => {
            console.log('user',userResult);
            if (userResult.deletedCount == 0) {
                return res
                    .status(404)
                    .json({'message': `No existe un usuario con id: ${req.params.userid}`});
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
    userList,
    createUser,
    readUser,
    updateUser,
    deleteUser
}