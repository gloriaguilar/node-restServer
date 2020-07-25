
require("./config/config");
const express = require("express");
const app     = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose"); //BD

const path = require("path");


// parse application/x-www-form-urlencoded
//Se va a disparar cada que se realice una petición
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Obtener el app configurado de routes
app.use(require("./routes/index"));

//Conexion a la DB

//Habilitar la carpeta public
app.use(express.static( path.resolve(__dirname, "../public" )));

console.log( path.resolve(__dirname, "../public" ));

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