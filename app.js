var express = require('express');
var mongoose = require('mongoose');


var app = express();
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err;

    console.log('Base de datos conectada');
});

app.get('/', ( req, res, next ) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Tarea realizada correctamente'
    });
});

app.listen(3000, () => {
    console.log('Express server inicializado en el puerto 3000');
});