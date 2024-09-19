// Obtenemos elementos del HTML
const tasksContainer = document.querySelector("#tasks");
const createEditBtn = document.querySelector("#create-task");
const input = document.querySelector("#task-name");

// creamos esta variable para que el server en el cual hosteamos la app no se rompa
const baseBackendUrl = `${window.origin}/api`;

const greenColor = () => {
  createEditBtn.classList.add("create-tasks2");
  createEditBtn.classList.remove("create-tasks");
};

const blueColor = () => {
  createEditBtn.classList.add("create-tasks");
  createEditBtn.classList.remove("create-tasks2");
};

let TASK_TO_EDIT = null;

//Nutrir de funcionalidad al botón crear tarea
createEditBtn.addEventListener("click", () => {
  const creating = !TASK_TO_EDIT;
  const path = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`;
  const method = creating ? "POST" : "PUT";

  fetch(`${baseBackendUrl}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: input.value }),
  }).then((res) => {
    getTasks(); // Esto actualizará la lista de tareas
    input.value = "";
    createEditBtn.innerText = "Crear Tarea";
    blueColor();
    TASK_TO_EDIT = null;
  });
});

// Función para obtener las tareas del backend
const getTasks = () => {
  fetch(`${baseBackendUrl}/tasks`)
    .then((res) => res.json())
    .then((resJSON) => {
      const tasks = resJSON.data;

      // Limpiar el contenedor de tareas antes de agregar las tareas
      tasksContainer.innerHTML = "";
      //Ciclo for para que por cada tarea haga lo siguiente
      for (const task of tasks) {
        //crear elemento div para mostrar tarea en el html
        const taskParagraph = document.createElement("div");
        //se le agrega estas clases para el hover de editar es algo visual nada mas
        taskParagraph.classList.add("task");
        taskParagraph.classList.add("tooltip");
        //se crea el boton para poder eleminar las tareas
        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.innerText = "Borrar";
        deleteTaskBtn.classList.add("clear-button");
        //se crea este elemento para hover de editar es algo visual nada mas
        const editTaskBtn = document.createElement("div");
        editTaskBtn.innerText = "Editar";
        editTaskBtn.classList.add("message");

        //se crea un contenedor para cada tarea asi poder borrar la tarea que se indique
        const taskContainerDiv = document.createElement("div");
        taskContainerDiv.classList.add("task-container");

        //Se le agrega el texto a la tarea
        taskParagraph.innerText = task.name;
        //se le asigna un id a cada tarea para cuando borremos no se borren todas y se borre solo la indicada
        deleteTaskBtn.setAttribute("id", task._id);
        deleteTaskBtn.addEventListener("click", (e) => {
          const taskId = task._id;
          input.value = "";
          createEditBtn.innerText = "Crear Tarea";
          blueColor();
          TASK_TO_EDIT = null;
          deleteTaskBtn.innerText = "...";
          fetch(`${baseBackendUrl}/tasks/${taskId}`, {
            method: "DELETE",
          }).then(() => {
            const taskDiv = deleteTaskBtn.parentElement;
            taskDiv.remove();
          });
        });

        taskParagraph.addEventListener("click", (e) => {
          // Elimina la clase 'editing' de la tarea previamente editada si existe
          if (TASK_TO_EDIT) {
            document.querySelector(`.task[data-id="${TASK_TO_EDIT._id}"]`)?.classList.remove("editing");
          }

          // Marca la tarea actual como la que está siendo editada
          input.value = task.name;
          createEditBtn.innerText = "Editar Tarea";
          greenColor();
          TASK_TO_EDIT = task;

          // Aplica la clase 'editing' a la tarea actual
          taskParagraph.classList.add("editing");
          taskParagraph.setAttribute("data-id", task._id); // Añade un atributo data-id para selección futura
        });

        taskContainerDiv.appendChild(taskParagraph);
        taskContainerDiv.appendChild(deleteTaskBtn);
        tasksContainer.appendChild(taskContainerDiv);
        taskParagraph.appendChild(editTaskBtn);
      }
    });
};



getTasks();
