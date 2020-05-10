const express = require('express')
const fileUpload = require('express-fileupload')
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')


const fs = require('fs')
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })



    //validar tipo 
    let tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.includes(tipo))
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no permitido. Permitidas: ' + tiposValidos.join(', ')
            }
        })





    let archivo = req.files.archivo;
    let fileU = archivo.name.split('.');
    let ext = fileU[fileU.length - 1];
    //extensiones permitidas
    let extensionAllow = ['png', 'jpg'];
    if (!extensionAllow.includes(ext))
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension no permitida. Permitidas: ' + extensionAllow.join(', '),
                ext
            }
        })

    //Cambiar nombre archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ext}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        //La imagen se cargó

        if (tipo === 'usuarios')

            imagenUsuario(id, res, nombreArchivo);
        else
            imagenProducto(id, res, nombreArchivo)
    });


});


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios')

            return res.status(500).json({
                ok: false,
                err
            })

        }
        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios')


            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })

        }



        borraArchivo(usuarioDB.img, 'usuarios')
        usuarioDB.img = nombreArchivo;


        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });

    });
}


function imagenProducto(id, res, nombreArchivo) {

    
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos')

            return res.status(500).json({
                ok: false,
                err
            })

        }
        if (!productoDB) {
            if(productoDB.img != '' || productoDB != null )
                borraArchivo(nombreArchivo, 'productos')


            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })

        }



        borraArchivo(productoDB.img, 'productos')
        productoDB.img = nombreArchivo;


        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });

    });
}


function borraArchivo(nombreImagen, tipo) {
    let pathUri = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    let test = fs.existsSync(pathUri);
    if (fs.existsSync(pathUri)) {
        fs.unlinkSync(pathUri);
    }
}

module.exports = app;