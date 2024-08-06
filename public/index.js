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
  //Dependiendo de la variable TASK TO EDIT '' | undefined se define si sera una peticion de POST O PUT 
  const creating = !TASK_TO_EDIT;
  const path = creating ? "tasks" : `tasks/${TASK_TO_EDIT._id}`;
  const method = creating ? "POST" : "PUT";

  //Hacemos una petición de tipo POST a la ruta especificada
  fetch(`${baseBackendUrl}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: input.value }),
  }).then((res) => {
    //Recargamos las tareas para que se vean actualizadas en el front
    getTasks();
    input.value = "";
    createEditBtn.innerText = "Crear Tarea";
    blueColor();
    TASK_TO_EDIT = null;
    return res.json();
  });
});

//Función para obtener las tareas del backend
const getTasks = () => {
  //Limpiamos el contenido del contenedor de tareas
  tasksContainer.innerHTML = null;
  //Realizamos una peticion a nuestra ruta
  fetch(`${baseBackendUrl}/tasks`)
    .then((res) => res.json())
    .then((resJSON) => {
      //Almacenamos las tareas en una constante
      const tasks = resJSON.data;
      //Utilizamos un ciclo for para que por cada tarea que tengamos se muestre en el front
      for (const task of tasks) {
        //Creamos una constante para que por cada tarea se haga una etiqueda p(parrafo) en el html
        const taskParagraph = document.createElement("p");
        //Creamos un boton para eleminar las tareas
        const deleteTaskBtn = document.createElement("button");
        deleteTaskBtn.innerText = "Borrar";
        deleteTaskBtn.classList.add("clear-button");
        const taskContainerDiv = document.createElement("div");
        //Le agregamos
        taskParagraph.innerText = task.name;
        deleteTaskBtn.setAttribute("id", task._id);
        deleteTaskBtn.addEventListener("click", (e) => {
          const taskId = task._id;
          deleteTaskBtn.innerText = "...";
          fetch(`${baseBackendUrl}/tasks/${taskId}`, {
            method: "DELETE",
          }).then(() => {
            const taskDiv = deleteTaskBtn.parentElement;
            taskDiv.remove();
          });
        });
        taskParagraph.addEventListener("click", (e) => {
          input.value = task.name;
          createEditBtn.innerText = "Editar Tarea";
          greenColor();
          TASK_TO_EDIT = task;
        });
        //Agregamos el párrafo al contenedor de tareas en el HTML
        taskContainerDiv.appendChild(taskParagraph);
        //Agregamos el botón de eleminación al párrafo
        taskContainerDiv.appendChild(deleteTaskBtn);
        tasksContainer.appendChild(taskContainerDiv);
      }
    });
};

getTasks();
