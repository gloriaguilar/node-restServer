/**
 * Created by Gloria on 24/07/2020.
 */
const express  = require("express");
const app = express();
const {verificaToken} = require("../middlewares/autenticacion");

let Producto = require("../models/producto");

//Obtener todos los prodcutos
//USuario y categoria
app.get('/productos',verificaToken ,(req, res) => {

    Producto.find({disponible:true})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err,productos) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                productos
            })
        });
});

//Obtener producto por ID
app.get('/productos/:id',verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err,productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if(!productoDB){
                return res.status(500).json({
                    ok:false,
                    err:{
                        message:"El id del producto no es correcto"
                    }
                })
            }
            res.json({
                ok:true,
                productoDB
            })
        });
});

//Crear un productp
app.post('/productos',verificaToken, (req, res) => {

    let body = req.body;

    console.log(body);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario:req.usuario._id,
        categoria: body.categoria

    });

    producto.save((err,productoDB)=> {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"No se pudo crear el producto"
                }
            })
        }
        res.json({
            ok:true,
            producto:productoDB
        })
    });
});

//Actualizar un producto
app.put('/productos/:id', (req, res) => {
    let id = req.params.id;
    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:"Producto id no existe"
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoActulizado) =>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.send({
                ok:true,
                producto:productoActulizado
            });

        });


    });
});

//Borrar un producto
//Actiulizar disposble a falso
app.delete('/productos/:id', verificaToken,(req, res) => {
    let id = req.params.id;
    //Obtener lo que mandan en el body x-www-form-urlenconde
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:"Producto id no existe"
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save((err, productoActulizado) =>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.send({
                ok:true,
                producto:productoActulizado
            });

        });
    });
});


//Buscar por termino
app.get('/productos/buscar/:termino',verificaToken, (req, res) => {
    let id = req.params.id;

    let termino= req.params.termino;


    //Esto es como el Like en sql
    let regex = new RegExp(termino, "i");

    Producto.find({nombre:regex})
        .populate('categoria', 'descripcion')
        .exec((err,productosDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            if(!productosDB){
                return res.status(500).json({
                    ok:false,
                    err:{
                        message:"El id del producto no es correcto"
                    }
                })
            }
            res.json({
                ok:true,
                productosDB
            })
        });
});

module.exports=app;