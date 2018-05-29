const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');


//==========================================
// Obtener productos
//==========================================

app.get('/productos', verificaToken, (req, res, ) => {

    let body = req.body;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos

            });


        });

});

//==========================================
// Obtener productos por id
//==========================================

app.get('/productos/:id', verificaToken, (req, res, ) => {


    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//============================================
// Crear un producto
//============================================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });


});

//=============================================
// Actualizar un producto
//==============================================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descProductos = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id, descProductos, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });


});

//=========================================
// Buscar productos
//=========================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ disponible: true, nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Producto no encntrado'
                    }
                });
            }


            res.json({
                ok: true,
                productos,
                mensaje: 'Producto encontrado'

            });




        });
})

//=============================================
// Borrar un producto /estado
//=============================================

app.delete('/productos/:id', verificaToken, (req, res, ) => {

    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        })

    });

});
module.exports = app;