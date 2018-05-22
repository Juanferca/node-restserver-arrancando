const jwt = require('jsonwebtoken');


//======================================
// Verificar Token
//======================================

let verificarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });



};

//========================================
// VerificaAdminRole
//========================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {}
    return res.json({
        ok: false,
        err: {
            message: 'El usuario no es administrador'
        }
    });
};


module.exports = {
    verificarToken,
    verificaAdmin_Role
};