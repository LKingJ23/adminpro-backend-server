var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if ( err ) throw err;

    console.log('Base de datos conectada');
});

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


app.listen(3000, () => {
    console.log('Express server inicializado en el puerto 3000');
});