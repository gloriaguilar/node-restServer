//Configuracion de puerto
//Para produccion o dessarrollo

process.env.PORT = process.env.PORT || 3000;


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Base de datos

let urlDB;

if(process.env.NODE_ENV === "dev"){
    urlDB= "mongodb://localhost:27017/cafeteria";
}else{
    urlDB="mongodb+srv://gloris:0dYryIsRwHbEck87@cluster0.kswmy.mongodb.net/cafeteria?retryWrites=true&w=majority";
}

process.env.URLDB=urlDB;