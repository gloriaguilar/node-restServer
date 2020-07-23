/**
 * Created by Gloria on 23/07/2020.
 */
const express  = require("express");
const app = express();


//Plugin para encriptar contraseñas
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");

//Se obtiene la config del modelo
const Usuario = require("../models/usuario");



app.post('/login', (req,res) => {


    let body = req.body;

    Usuario.findOne({email:body.email }, (err, usuarioDB)=> {

        if(err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }



        if( !usuarioDB ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "(Usuario) / Password incorrecto"
                }
            });
        }

            if(!bcrypt.compareSync(body.password, usuarioDB.password)){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: "Usuario / (Password) incorrecto"
                    }
                });
            }


        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn:process.env.CADUCIDAD_TOKEN});

            res.json({
                ok:true,
                token
            });
    });

});


module.exports = app;