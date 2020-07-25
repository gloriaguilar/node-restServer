/**
 * Created by Gloria on 23/07/2020.
 */

const express = require("express");

let app = express();
const {verificaToken, verificaAdminRol} = require("../middlewares/autenticacion");

let Categoria = require("../models/categoria");
const _ = require('underscore');

//Mostrar todas las categorias
//Populate encuentra la relación con la coleccion que se le amanda de parametro
app.get("/categoria", verificaToken,(req, res) =>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err,categorias) =>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

            res.json({
                ok:true,
                categorias
            })
        });

});


//Mostrar una categoria por id
app.get("/categoria/:id", (req,res) =>{

    let id = req.params.id;

    Categoria.findById(id, (err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:"El id no es correcto"
                }
            })
        }
        res.json({
            ok:true,
            categoriaDB
        })
    });
});


//Crear nueva categoría con tokens
//regresar nueva categoria

app.post('/categoria',verificaToken,(req, res) => {
    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = req.body;

    //Aqui se establece lo que viene del POST
    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    });

    categoria.save((err,categoriaDB)=> {

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"No se pudo crear la cztegoria"
                }
            })
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    });


});

//Put actualizar categoria
app.put("/categoria/:id", [verificaToken,verificaAdminRol],(req, res) => {


    let id = req.params.id;
    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = req.body;
    let actualizaDesc = {
        descripcion:body.descripcion
    };

    Categoria.findByIdAndUpdate(id, actualizaDesc ,{new:true ,runValidators:true},(err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.send({
            ok:true,
            categoria:categoriaDB
        });

    });

});

//Delete categoria
app.delete("/categoria/:id", [verificaToken,verificaAdminRol], (req, res) => {

    let id = req.params.id;



    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"El id no existe"
                }
            })
        }

        res.send({
            ok:true,
            message:"Categoria borrada"
        });

    });


});

module.exports = app;