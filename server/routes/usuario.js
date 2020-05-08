const express = require('express')


const Usuario = require('../models/usuario')

const app = express();

const _ = require('underscore')


const bcrypt = require('bcrypt');
const { request } = require('express');



app.get('/usuario', function (req, res) {

    let page = 1;
    let itemPerPage = 5;

    if (req.query.page) {
        page = req.query.page;
    }
    const options = {
        select: 'nombre email',
        lean: true,
        page: page,
        limit: itemPerPage,
        sort: '_id'
    };
    Usuario.paginate({ estado : true}, options, (err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuarios
        })

    });

});

app.post('/usuario', function (req, res) {
    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
        // img: body.img
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

    if (body.nombre === undefined)
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'


        })
});


app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])



    let options = { new: true, runValidators: true }
    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {



        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })



    })
});


app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['estado'])



    let options = { new: true }
    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioDB) => {



        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })



    })

});


module.exports = app;