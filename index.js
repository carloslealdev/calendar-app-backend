const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();
const cors = require("cors");

//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio público
app.use(express.static("public"));

//Lectura y parseo del body
app.use(express.json());

//Rutas
//Le pido a la app que busque todo lo que está en la ruta de archivos(./routes.auth) y
//lo sirva en la dirección (/api/auth)
app.use("/api/auth", require("./routes/auth"));

app.use("/api/events", require("./routes/events"));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
