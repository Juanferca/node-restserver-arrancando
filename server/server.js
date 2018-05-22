const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')
require('./config/config')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000')

});