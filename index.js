require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const transporter = require("./helpers/mailer");
const jwt = require("jsonwebtoken")

//Conectar a MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB", { err });
  });

//Definir esquema de la colección tasks
const taskSchema = new Schema({
  name: String,
  done: Boolean,
  // createdBy:
});

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  login_code: String,
});

//Crear modelo de datos
const Task = mongoose.model("Task", taskSchema, "Tasks");
const User = mongoose.model("User", userSchema, "Users");

//Middleware
app.use(express.static("public", { extensions: ["html", "css", "js"] }));
app.use(express.json());

//CONFIGURAR RUTAS
app.get("/api/tasks", (req, res) => {
  Task.find()
    .then((tasks) => {
      res.status(200).json({ ok: true, data: tasks });
    })
    .catch((err) => {
      res.status(400).json({
        ok: false,
        message: `Hubo un error al obtener las tareas ${err}`,
      });
    });
});

app.post("/api/tasks", (req, res) => {
  const body = req.body;
  Task.create({
    name: body.text,
    done: false,
    hello: "hola",
  })
    .then((createdTask) => {
      res.status(201).json({
        ok: true,
        message: "Tarea creada con exito",
        data: createdTask,
      });
    })
    .catch((err) => {
      res.status(400).json({ ok: false, message: "Error al crear la tarea" });
    });
});

app.put("/api/tasks/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  Task.findByIdAndUpdate(id, {
    name: body.text,
  })
    .then((updatingTask) => {
      res.status(200).json({
        ok: true,
        message: "Tarea Actualizada con exito",
        data: updatingTask,
      });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ ok: false, message: `Error al editar la tarea ${err}` });
    });
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id)
    .then((deletedTask) => {
      res.status(200).json({ ok: true, data: deletedTask });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ ok: false, message: `Error al eleminar la tarea${err}` });
    });
});

app.post("/api/auth/login/:email/code", async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });



  if (!user) {
    // await User.create({email, firstname: 'Benjamin', lastname: 'Ormeño'})
    return res
      .status(400)
      .json({ ok: false, message: "No existe un usuario con ese correo" });
  }

  let code = ''

  for(let index = 0; index <= 5; index++){
    let character = Math.floor(Math.random() * 9)
    code += character
  }

  console.log({code})

  user.login_code = code
  await user.save()

  const result = await transporter.sendMail({
    from: `Benjamin Ormeño ${process.env.EMAIL}`,
    to: email,
    subject: "Codigo de inicio de sesion: " + code,
    body: "Este es tu codigo para iniciar sesion: ",
  })
  res.status(200).json({ ok: true, message: "codigo enviado con extio" });
});

app.post("/api/auth/login/:email", async (req, res) => {
  const { email } = req.params;

  const {code} = req.body

  const user = await User.findOne({ email, login_code: code });



  if (!user) {
    // await User.create({email, firstname: 'Benjamin', lastname: 'Ormeño'})
    return res
      .status(400)
      .json({ ok: false, message: "Credenciales invalidas" });
  }
  
  user.login_code = code
  await user.save()

  const tokenPayload =  {
    _id: user._id,
    firstname: user.firstname,
    email: user.email

  }

  const token = jwt.sign(tokenPayload,process.env.JWT_SECRET_KEY)
  console.log({token})
  res.cookie('jwt', token)
  
  res.status(200).json({ ok: true, data: tokenPayload,message: "Inicio de sesion exitoso" });
});
//PONER A ESCUCHAR LA APP EN UN PUERTO
app.listen(PORT, (req, res) => {
  console.log("Servidor escuchando en el puerto: " + PORT);
});
