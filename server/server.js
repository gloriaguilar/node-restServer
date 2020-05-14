
const express = require("express");
const app     = express();
require("./config/config");
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
//Se va a disparar cada que se realice una petición
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//Get: Obtener datos
app.get('/usuario', (req, res) => {
    res.send("Get usuario");
});

//Post insertar registro
app.post('/usuario', (req, res) => {

    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = req.body;
    res.json({
        body
    });
});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    res.send({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.send("Delete usuario");
});


//Obtiene el valor de config.js
app.listen(process.env.PORT, ()  =>  {
    console.log("Escuchando en el puerto");
});