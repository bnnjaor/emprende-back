const { Task } = require("../models/task");


const getAll = (req, res) => {
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

const create = (req, res) => {
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
