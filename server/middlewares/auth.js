
const jwt = require('jsonwebtoken');



//Verificar token



let verificaToken = (req, res, next) => {

    let token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    })
};


//Verifica ROLE

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }



};



module.exports = {
    verificaToken,
    verificaAdminRole
};