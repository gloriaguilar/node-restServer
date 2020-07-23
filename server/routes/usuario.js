const express  = require("express");
const app = express();


//Plugin para encriptar contraseñas
const bcrypt = require('bcrypt');


//Para meter validaciones en el PUT
const _ = require('underscore');

//Se obtiene la config del modelo
const Usuario = require("../models/usuario");
/**PETICIONES GET, POST, PUT, DELETE**/

//GET: Obtener datos
app.get('/usuario', (req, res) => {


    //Esto es un parametro opcional
    //Se utilizara para que nos traiga el registro apartir de
    // {url}/usuario?desde=5
    let desde = req.query.desde || 0;
    desde     = Number(desde);

    let limite = req.query.limite || 5;
    limite     = Number(limite);

    Usuario.find({estado:true}, 'nombre email google role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }

            Usuario.count({estado:true},(err,conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    numero:conteo
                })
            });


        });
});

//POST: Insertar registro
app.post('/usuario', (req, res) => {
    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = req.body;


    //Aqui se establece lo que viene del POST
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role : body.role
    });

    //save: palabra reservada de moongose.
    usuario.save((err,usuarioDB)=> {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    });
});

//PUT: Normalmente se usa para actualizar
app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = _.pick(req.body,['nombre', 'img','email', 'role', 'estado']);

    //El objeto {new:true} es para que ya traiga los datos actualizados
    //Si se le quita, mostrara los registros sin las modificaciones
    //runValidators: Es para correr las valdiaciones que se definen en el Schema (modelo)
    Usuario.findByIdAndUpdate(id, body ,{new:true ,runValidators:true},(err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.send({
            ok:true,
            usuario:usuarioDB
        });

    });


});

//DELETE: Elimina elementos
app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    let actualizar = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, actualizar , {new:true} ,(err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.send({
            ok:true,
            usuario:usuarioDB
        });

    });
});

module.exports = app;