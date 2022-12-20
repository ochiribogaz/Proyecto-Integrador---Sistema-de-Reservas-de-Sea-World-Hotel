const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const mailManager = require('./mail-manager')


const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "Por favor llene todos los campos" });
    }
    passport.authenticate('local', (err, user, info) => { //Pasa el nombre de la estrategia y una devolución de llamada para autenticar el método
        if (err) { //Devuelve un error si Passport devuelve un error
            console.log(err);
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            const token = user.generateJwt();
            console.log('El link generado es inválido');
            res
                .status(200)
                .json({ token });
        } else {
            console.log("Info: ")
            console.log(info);
            res
                .status(401)
                .json({"message": "Usuario o contraseña incorrectos"});
        }
    })(req, res);
};

const forgotPassword = (req, res) => {
    const email = req.body.email;
    console.log('El Email es: ',email);
    User.findOne({ 'email': email })
        .exec(async(err, user) => {
            if (!user) {
                return res.status(404).json({ 'message': 'Usuario o contraseña incorrectos' })
            } else if (err) { // find encontro un error
                return res // respondo el error en formato JSON y status HTTP 404
                    .status(404)
                    .json(err);
            }

            const token = jwt.sign({ _id: user._id }, process.env.RESET_KEY, { expiresIn: '20m' });
            user.resetToken = token;

            
            user.save((err, users) => {
                if (err) {
                    return res
                        .status(404)
                        .json(err);
                } else {
                    try {
                        mail = mailManager.createResetEmail(user.email,user.name,token);
                         mailManager.transporter.sendMail(mail);
                    } catch (err) {
                        console.log("No se envió el mail");
                        console.log(err);
                    }
                    return res
                        .status(200)
                        .json(users);
                }
            })
        });
}

const resetPassword = (req, res) => {
    const resetToken = req.params.token;
    if (!resetToken) {
        return res.status(401).json({ error: "Error de Autenticación" })
    }
    jwt.verify(resetToken, process.env.RESET_KEY, (error) => {
        if (error) {
            return res.status(401).json({ error: "Token inválido" });
        }
        User.findOne({ 'resetLink': resetToken })
        .exec(async(err, user) => {
            if (!user) {
                return res.status(404).json({ 'Mensaje': 'No se encontró un usuario' })
            }
            else if (err) { // find encontro un error
                return res // respondo el error en formato JSON y status HTTP 404
                .status(404)
                .json(err);
            } else if (!req.body.password || !req.body.repeatedPassword) {
                return res
                .status(400)
                .json({ "message": "Todos los campos son requeridos" });
            } else if (req.body.repeatedPassword != req.body.password) {
                return res
                .status(400)
                .json({ "message": "Las contraseñas no coinciden" });
            }
            delete user.resetToken;
            user.setPassword(req.body.password);
            user.save((err, users) => {
                if (err) {
                    res
                    .status(404)
                    .json(err);
                }
                else {
                    res
                    .status(200)
                    .json(users);
                }
            });
        });
    });
}



module.exports = {
    login,
    forgotPassword,
    resetPassword
};