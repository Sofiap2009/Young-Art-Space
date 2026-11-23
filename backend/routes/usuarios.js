
const express = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
console.log("Modelo Usuario:", typeof Usuario);
console.log("Método findOne:", typeof Usuario.findOne);

const router = express.Router();

// Registrar un usuario
router.post("/registro", async (req, res) => {
    try {
        const { nombre, correo, usuario, contrasena } = req.body;

        // Comprobar que todos los campos estén completos
        if (!nombre || !correo || !usuario || !contrasena) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios."
            });
        }

        if (contrasena.length < 8) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 8 caracteres."
            });
        }

        // Comprobar si el correo o usuario ya existen
        const existente = await Usuario.findOne({
            $or: [
                { correo: correo.toLowerCase() },
                { usuario: usuario }
            ]
        });

        if (existente) {
            return res.status(409).json({
                mensaje: "El correo o nombre de usuario ya está registrado."
            });
        }

        // Proteger la contraseña
        const contrasenaHash = await bcrypt.hash(contrasena, 10);

        // Crear el usuario
        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            usuario,
            contrasena: contrasenaHash
        });

        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: "¡Cuenta creada correctamente!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "No se pudo crear la cuenta."
        });
    }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Comprobar que los campos estén completos
        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: "Ingresa tu correo y contraseña."
            });
        }

        // Buscar al usuario por su correo
        const usuarioEncontrado = await Usuario.findOne({
            correo: correo.toLowerCase().trim()
        });

        if (!usuarioEncontrado) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        // Comparar la contraseña ingresada con la guardada
        const contrasenaCorrecta = await bcrypt.compare(
            contrasena,
            usuarioEncontrado.contrasena
        );

        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        res.status(200).json({
            mensaje: "¡Inicio de sesión exitoso!",
            nombre: usuarioEncontrado.nombre
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "No se pudo iniciar sesión."
        });
    }
});

module.exports = router;
