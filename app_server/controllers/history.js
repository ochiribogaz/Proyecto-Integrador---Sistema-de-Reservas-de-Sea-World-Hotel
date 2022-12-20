variables = require('../variables/variables');

renderHistory = (req, res, next) => 
{
    res.render('history', {
        h1: 'Historia',
        company: variables.companyName,
        year: variables.year,
        title: `Historia | ${variables.companyName}`, //SEO Information
        canonical: 'https://seaworld-hotel.com/historia/',
        description: '',
        ogTitle: `${variables.companyName} | Historia`,
        ogUrl: 'https://seaworld-hotel.com/historia/',
        ogImage: 'https://lh3.googleusercontent.com/U3PwHl0hbIXP2PlJzfZ3d5eguJU5u54bGal8vxhn8l8nT1B3biGIGJ0ceaIBZNrF6WI14k7FYD4kPnQlDQ5appEgJghSkG22Wrk4W0hlU2ma_D5hQQ4Y_if9H5JNhP5BRtJGo0gp3dA=w2400'
    })
};

module.exports = {
    renderHistory
}