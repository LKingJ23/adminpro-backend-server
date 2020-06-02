var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

app.use(fileUpload());

app.put('/:tipo/:id', ( req, res, next ) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if ( !req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó imagen',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    var archivo = req.files.imagen;
    var nombreExtension = archivo.name.split('.');
    var extensionArchivo = nombreExtension[ nombreExtension.length - 1 ];

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf( extensionArchivo ) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones váliadas son: ' + extensionesValidas.join(', ') }
        });
    }

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
        subirPorTipo( tipo, id, nombreArchivo, res );
    });
});

function subirPorTipo( tipo, id, nombreArchivo, res ){
    if( tipo === 'usuarios' ){
        Usuario.findById( id, (err, usuario) => {
            if( !usuario ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var oldPath = './uploads/usuarios/' + usuario.img;

            if( fs.existsSync(oldPath) ){
                fs.unlinkSync( oldPath );
            }

            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado ) => {
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar usuario con su imagen',
                        errors: err
                    });
                }

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    extensionArchivo: usuarioActualizado
                });
            });
        });
    }

    if( tipo === 'medicos' ){
        Medico.findById( id, (err, medico) => {
            if( !medico ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }

            var oldPath = './uploads/medicos/' + medico.img;

            if( fs.existsSync(oldPath) ){
                fs.unlinkSync( oldPath );
            }

            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado ) => {
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar medico con su imagen',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    extensionArchivo: medicoActualizado
                });
            });
        });
    }

    if( tipo === 'hospitales' ){
        Hospital.findById( id, (err, hospital) => {
            if( !hospital ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var oldPath = './uploads/hospitales/' + hospital.img;

            if( fs.existsSync(oldPath) ){
                fs.unlinkSync( oldPath );
            }

            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado ) => {
                if( err ){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al guardar hospital con su imagen',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    extensionArchivo: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;