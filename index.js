//Importamos las dependencias y todas nuestras funciones o utilidades
require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require('./db/connect')
const transporter = require("./helpers/mailer");
const cookieParser = require("cookie-parser");
const tasksRoutes = require("./routes/task");
const authRoutes = require("./routes/auth");
const { jwtValidation } = require("./middlewares/jwtValidation");

//Nos conectamos a la BBDD
dbConnect()



//Middleware
app.use(express.static("public", { extensions: ["html", "css", "js"] }));
app.use(express.json());
app.use(cookieParser());



//Rutas para iniciar sesion
app.use('/api/auth',authRoutes)
//Middleware para validar JWT en las rutas protegidas
app.use(jwtValidation)
 //Rutas protegidas con JWT
app.use('/api/tasks',tasksRoutes)


//PONER A ESCUCHAR LA APP EN UN PUERTO
const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log("Servidor escuchando en el puerto: " + PORT);
});
