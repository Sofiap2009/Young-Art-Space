
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usuariosRoutes = require("./routes/usuarios");

const app = express();
const PORT = 3000;

// Configuración del servidor
app.use(express.json());
app.use(cors());

// Rutas de usuarios
app.use("/api/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
    res.send("¡El servidor de Young Art Space está funcionando!");
});

// Conexión con MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("¡Conexión exitosa con MongoDB!");

        app.listen(PORT, () => {
            console.log(`Servidor activo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar con MongoDB:", error.message);
    });
