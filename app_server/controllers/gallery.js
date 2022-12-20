variables = require('../variables/variables');

renderGallery = (req, res, next) => 
{
    res.render('gallery', {
        h1: 'Galería',
        company: variables.companyName,
        year: variables.year,
        title: `Galería | ${variables.companyName}`, //SEO Information
        canonical: 'https://seaworld-hotel.com/galeria/',
        description: '¡Disfruta de nuestra galería de fotos! Encontrarás fotos de nuestras nuevas instalaciones, servicio de calidad y del Balneario de San Jacinto, un pueblo turístico lleno de vida y hermosos atardeceres.',
        ogTitle: `${variables.companyName} | Galería`,
        ogUrl: 'https://seaworld-hotel.com/galeria/',
        ogImage: 'https://lh3.googleusercontent.com/U3PwHl0hbIXP2PlJzfZ3d5eguJU5u54bGal8vxhn8l8nT1B3biGIGJ0ceaIBZNrF6WI14k7FYD4kPnQlDQ5appEgJghSkG22Wrk4W0hlU2ma_D5hQQ4Y_if9H5JNhP5BRtJGo0gp3dA=w2400'
    })
};

module.exports = {
    renderGallery
}