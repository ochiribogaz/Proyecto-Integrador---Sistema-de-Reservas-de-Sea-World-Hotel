variables = require('../variables/variables');

renderIndex = (req, res, next) => 
{
    res.render('index', {
        h1: variables.companyName,
        year: variables.year,
        company: variables.companyName,
        mail: variables.companyMail,
        address: variables.companyAddress,
        gmap: variables.companyGmap,
        city: variables.companyCity,
        title: 'Hotel Sea World en San Jacinto, Manabí, con vista al mar', //SEO Information
        canonical: 'https://seaworld-hotel.com/',
        description: '¡Bienvenido al Sea World Hotel! Nos encontramos en las paradisíacas playas de San Jacinto, Manabí, Ecuador. En Sea World Hotel, tú eres lo primero. Ven junto a tu familia, siéntete como en casa y disfruta de nuestros servicios de calidad. Reserva ahora y estaremos encantados de atenderte.',
        ogTitle: `${variables.companyName} | Inicio`,
        ogUrl: 'https://seaworld-hotel.com/',
        ogImage: 'https://lh3.googleusercontent.com/U3PwHl0hbIXP2PlJzfZ3d5eguJU5u54bGal8vxhn8l8nT1B3biGIGJ0ceaIBZNrF6WI14k7FYD4kPnQlDQ5appEgJghSkG22Wrk4W0hlU2ma_D5hQQ4Y_if9H5JNhP5BRtJGo0gp3dA=w2400'
    })
};

module.exports = {
    renderIndex
}