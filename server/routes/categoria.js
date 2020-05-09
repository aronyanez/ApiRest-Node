const express = require('express')

let app = express();
let Categoria = require('../models/categoria')

const _ = require('underscore')

const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

//Mostrar todas las categorías
app.get('/categoria', verificaToken, (req, res) => {

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
        populate: ({ path: 'usuario', select: 'nombre email' })

    };
    Categoria.paginate({}, options, (err, categorias) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categorias
        })

    });

});


//Mostrar una categoría
app.get('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;


    Categoria.findById(id, (err, categoria) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No existe la categoría"
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })

    });

});

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    if (body.nombre === undefined)
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'


        })


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);


    let options = { new: true, runValidators: true }
    Categoria.findByIdAndUpdate(id, body, options, (err, categoriaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })



    })


});


app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let options = { new: true, runValidators: true }
    Categoria.findByIdAndRemove(id, options, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }



        res.json({
            ok: true,
            err: {
                message: 'Categoría borrada'
            }
        })



    })
});


module.exports = app;