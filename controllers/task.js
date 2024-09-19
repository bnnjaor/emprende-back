const { Task } = require("../models/task");

//Creamos una funcion para obtener las tareas de la BBDD
const getAll = (req, res) => {
  //utilizamos find con el schema que creamos
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
};

//Creamos una funcion para crear tareas y guardarlas en la BBDD
const create = (req, res) => {
  //Guardamos la tarea en la variable body
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
};

const update = (req, res) => {
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
  }

const remove = (req, res) => {
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
  }

module.exports = {
  getAll,
  create,
  update,
  remove
};
