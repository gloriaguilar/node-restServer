
const moongose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");



//Objeto para hacer la validacion de los roles
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role valido'
};

//Se inicia la configuraciín del modelo con moongose
let Schema  = moongose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required : [true, "El nombre es obligatprop"]
    },
    email:{
        type: String,
        unique: true,
        required: [true, "El email es obligatorio"]
    },
    password:{
        type: String,
        required: [true, "El password  es obligatorio"]
    },
    img: { //Imagen no es obligatoria
        type: String,
        required: false
    },
    role:{
        type: String,
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.methods.toJSON = function () {

    //Con esto, ya no regresa el password en la respuesta del API
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator ,{message: '{PATH} debe ser unico'});

//De esta forma se exportan los modelos de Mongo
module.exports= moongose.model("Usuario", usuarioSchema);
