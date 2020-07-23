/**
 * Created by Gloria on 23/07/2020.
 */



const jwt = require("jsonwebtoken");

//Verificar toke

let verificaToken = (req,res,next)=> {

    //Obtener los headers
    let token = req.get("token");

    jwt.verify(token , process.env.SEED , (err, decoded)=>{

        if( err ){
            return res.status(401).json({
               ok:false,
                err:{
                   message:"Toke no valido"
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

let verificaAdminRol = (req,res,next)=> {

//    let token = req.get("token");

    let usuario = req.usuario;
    console.log(usuario);

    if(usuario.role==="ADMIN_ROLE"){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message:"Usuario no es admin"
            }
        });
    }


};

module.exports = {
    verificaToken,
    verificaAdminRol
}