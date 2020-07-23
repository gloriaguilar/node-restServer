
require("./config/config");
const express = require("express");
const app     = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose"); //BD


// parse application/x-www-form-urlencoded
//Se va a disparar cada que se realice una petición
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Obtener el app configurado de routes
app.use(require("./routes/usuario"));

//Conexion a la DB

mongoose.connect(process.env.URLDB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
},(err) => {

    if(err) throw new err;
    console.log("Base de datos Online",process.env.URLDB);
});


//Obtiene el valor de config.js
app.listen(process.env.PORT, ()  =>  {
    console.log("Escuchando en el puerto", process.env.PORT);
});