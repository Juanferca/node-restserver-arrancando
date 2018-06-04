const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }

            });
    }


    // Valida tipo

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(' y '),
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];



    console.log(extension);

    // Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenxiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }

        })
    }

    // Cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aqui, imagen cargada

        // imagenUsuario(id, res, nombreArchivo);

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        }


    });
});

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }

            });
        }

        /*let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }*/

        borraArchivo(usuarioDB.img, 'usuarios');

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

const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {

            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }

            });
        }

        /*let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }*/

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });




};



const borraArchivo = (nombreImagen, tipo) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }



}

module.exports = app;