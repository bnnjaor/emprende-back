require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

//Crear modelo de datos
const Task = mongoose.model("Task", taskSchema, "Tasks");

//Middleware
app.use(express.static("public"));
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
  Task.findByIdAndUpdate(id,{
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
      res.status(400).json({ ok: false, message: `Error al editar la tarea ${err}`});
    });
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id).then((deletedTask)=>{
    res.status(200).json({ok:true, data:deletedTask});
  }).catch((err) => {res.status(400).json({ok:false, message: `Error al eleminar la tarea${err}`});});
})

//PONER A ESCUCHAR LA APP EN UN PUERTO
app.listen(PORT, (req, res) => {
  console.log("Servidor escuchando en el puerto: " + PORT);
});
