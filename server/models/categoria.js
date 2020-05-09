
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'Nombre de la categoría requerido']
    },

    descripcion: {
        type: String,
        required: [true, 'Descripción de la categória requerida']

    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })
categoriaSchema.plugin(mongoosePaginate)


module.exports = mongoose.model('Categoria', categoriaSchema)