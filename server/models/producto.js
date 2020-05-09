const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        default: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

productoSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Producto', productoSchema);