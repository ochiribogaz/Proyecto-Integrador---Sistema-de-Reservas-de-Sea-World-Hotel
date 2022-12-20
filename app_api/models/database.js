// DATABASE MODELS
const mongoose = require('mongoose'); /* Importing the mongoose module. */

const readline = require('readline'); /* A module that allows you to read a line of text from the console. */

/* Listener for the SIGINT event on Windows */
if(process.platform === 'win32'){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit('SIGINT'); /* Emitting SIGINT event to Node. */
    });
}

/**
 * This function closes the Mongoose connection and logs a message to the console.
 * @param message - The message to display when the process is shutting down.
 * @param callback - A function that will be called when the process is about to exit.
 */
const procShutdown = (message, callback) => {
    mongoose.connection.close(() => {
        console.log(`Desconexión de Mongoose desde: ${message}`);
        callback();
    });
}

/* End process events
Windows: SIGINT
Nodemon: SIGUSR2
Heroku: SIGTERM
*/

// SIGINT - Windows
process.on('SIGINT', () =>{
    procShutdown('App cerrada desde Windows', () => {
        process.exit(0);
    });
});

// SIGUSR2 - Nodemon
process.on('SIGUSR2', () =>{
    procShutdown('App reiniciada desde Nodemon', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// SIGTERM - Heroku
process.on('SIGTERM', () =>{
    procShutdown('App cerrada desde Heroku', () => {
        process.exit(0);
    });
});


let dbURI = 'mongodb://localhost/db_booking_admin'; //Connection string
if(process.env.NODE_ENV === 'production'){
    dbURI = process.env.MONGODB_URI;
}

/* Connecting to the database. */
mongoose.connect(dbURI, { useNewUrlParser: true });

/* Messages for connection events */
mongoose.connection.on('error', err => {
    console.error(`Error de conexión de Mongoose: ${err}`)
});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose se conectó a: ${dbURI}`);
});

mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose se desconectó de: ${dbURI}`);
});

const client = mongoose.connection;
module.exports = {client};

/* Importing the models. */
require('./user_scheme');
require('./room_scheme');
require('./room_type_scheme');
require('./booking_scheme');
require('./customer_scheme');
