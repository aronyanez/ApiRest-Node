const express = require('express')


const { verificaToken } = require('../middlewares/auth');

const fs = require('fs')


const path = require('path');


const app = express();


app.get('/imagen/:tipo/:img', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathUri = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathUri)) {

        res.sendFile(pathUri);
    } else {


        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

        res.sendFile(noImagePath);
    }


});



module.exports = app;