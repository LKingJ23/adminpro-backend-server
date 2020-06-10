const express = require('express');

const app = express();

const Hospital = require('../models/hospital');
const mdAutenticacion = require('../middlewares/autenticacion');

app.get('/', ( req, res, next ) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec(
        ( err, hospitales ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando hospitales',
                errors: err
            });
        }

        Hospital.countDocuments({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                hospitales: hospitales,
                total: conteo
            });
        });
    });
});

app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {
    const id = req.params.id;
    const body = req.body;

    Hospital.findById( id, (err, hospital) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if ( !hospital ) {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + ' no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado ) =>{
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });

});

app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {
    const body = req.body;

    const hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( ( err, hospitalGuardado ) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    
    });

});

app.delete('/:id', mdAutenticacion.verificaToken, ( req, res ) => {
    const id = req.params.id;

    Hospital.findByIdAndDelete( id, (err, hospitalBorrado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if ( !hospitalBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });

});

module.exports = app;