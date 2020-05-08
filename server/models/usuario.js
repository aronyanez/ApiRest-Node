
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarioScrema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre requerido']
    },

    password: {
        type: String,
        required: [true, 'Password requerido']

    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email requerido']

    },
    img: {
        type: String,
        required: false

    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false


    }

});


usuarioScrema.methods.toJSON = function () {
    let user = this;

    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}



usuarioScrema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })
usuarioScrema.plugin(mongoosePaginate)


module.exports = mongoose.model('Usuario', usuarioScrema)