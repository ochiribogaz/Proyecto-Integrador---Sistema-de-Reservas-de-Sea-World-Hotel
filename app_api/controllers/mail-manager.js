const nodemailer = require("nodemailer");

const apiOptions = {
    server: 'http://localhost:4200' // servidor local - desarrollo
};

if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://seaworld-hotel.herokuapp.com' // servidor remoto - producción
}

const FROM = `"Sea World Hotel" <${process.env.EMAIL}>`;


// create reusable transporter object using the SMTP transport
const createResetEmail =  (email,username,token) => {
    return {
        from: FROM,
        to: email,
        subject: "Sea World Hotel - Reestablecimiento de contraseña", // Subject line
        html: `<p>¡Hola ${username}!
        <br>Se ha generado el link para reestablecer tu contraseña.</p>
        <a href="${apiOptions.server}/BookingAdmin/RecuperarContrasena/${token}"> Da clic aquí para reestablecer tu contraseña</a>`, // html body
    };

}

const createNewUserEmail =  (user,tempPassword) => {
    return {
        from: FROM,
        to: user.email,
        subject: "Sea World Hotel - Bienvenido", // Subject line
        html: `<p>¡Hola ${user.name}!
        <br>Bienvenido al Sistema de Reserva de Sea World Hotel.</p>
        <p>Estos son los datos de tu cuenta:</p>
        <p>Usuario: ${user.email}</p>
        <p>Contraseña temporal: ${tempPassword}</p>
        <p>Ingresa a la aplicación: ${apiOptions.server}/BookingAdmin/</p>` // html body
    };

}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.GMAIL_KEY // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log("Listo para envío de mails");
});

console.log('Esto esta funcionando');


module.exports = {
    transporter,
    createResetEmail,
    createNewUserEmail
};