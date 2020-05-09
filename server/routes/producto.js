const express = require('express')

let app = express();

let Producto = require('../models/producto')


const _ = require('underscore')

const { verificaToken } = require('../middlewares/auth');


//buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre').exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos
            })
        })

});


//Obtener productos

app.get('/producto', verificaToken, (req, res) => {
    let page = 1;
    let itemPerPage = 10;

    if (req.query.page) {
        page = req.query.page;
    }
    const options = {
        lean: true,
        page: page,
        limit: itemPerPage,
        sort: 'nombre',
        populate: [
            { path: 'categoria', select: 'nombre' },
            { path: 'usuario', select: 'nombre email' }
        ]

    };
    Producto.paginate({}, options, (err, productos) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            productos
        })

    });
});

//producto por id

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "No existe el producto"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            })

        });


});

//crear producto
app.post('/producto/', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    if (body.nombre === undefined)
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    if (body.precioUni === undefined)
        res.status(400).json({
            ok: false,
            mensaje: 'El Precio unitario es necesario'
        })


    producto.save((err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        });

    });




});

//actualizar producto
app.put('/producto/:id', verificaToken, (req, res) => {


    let id = req.params.id;

    let body = req.body;


    let options = { new: true, runValidators: true }
    Producto.findByIdAndUpdate(id, body, options, (err, productoBD) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }


        res.json({
            ok: true,
            producto: productoBD
        })



    })




});



//borrar producto

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['disponible'])



    let options = { new: true }
    Producto.findByIdAndUpdate(id, body, options, (err, productoBD) => {



        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: productoBD
        })



    })

});

module.exports = app;