console.log('Este JS va a ser interpretado por el NAVEGADOR')

const tasksContainer = document.querySelector('#tasks')
const createEditBtn = document.querySelector("#create-task")
const input = document.querySelector("#task-name")

const baseBackendUrl = `${window.origin}/api`

const greenColor = ()=>{
    createEditBtn.classList.add('create-tasks2')
    createEditBtn.classList.remove('create-tasks')
}

const blueColor = ()=>{
    createEditBtn.classList.add('create-tasks')
    createEditBtn.classList.remove('create-tasks2')
}

let TASK_TO_EDIT = null

//Nutrir de funcionalidad al botón crear tarea
createEditBtn.addEventListener("click",() =>{
    //Hacemos una petición de tipo POST 
    const creating = !TASK_TO_EDIT
    const path = creating ? 'tasks': `tasks/${TASK_TO_EDIT._id}`
    const method = creating ? 'POST' : 'PUT'
    
    
    
    fetch(`${baseBackendUrl}/${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: input.value})
    })
     .then((res)=>{
        getTasks()
        input.value = ''
        createEditBtn.innerText = "Crear Tarea"
        blueColor()
        TASK_TO_EDIT = null
        return res.json()
     })
     .then((resJSON)=>{
        console.log({resJSON})
     })
});

//Función para obtener las tareas del backend
const getTasks = ()=>{
    tasksContainer.innerHTML = null
    fetch(`${baseBackendUrl}/tasks`)
        .then((res)=> res.json())
        .then((resJSON)=> {
            console.log(resJSON);
            //Almacenamos las tareas en una constante
            const tasks = resJSON.data
            //Utilizamos un ciclo for para que por cada tarea que tengamos se muestre en el front
            for(const task of tasks){
                console.log({task})
                //Creamos una constante para que por cada tarea se haga una etiqueda p(parrafo) en el html
                const taskParagraph = document.createElement('p')
                //Creamos un boton para eleminar las tareas
                const deleteTaskBtn = document.createElement('button')
                deleteTaskBtn.innerText = "Borrar"
                deleteTaskBtn.classList.add("clear-button")
                const taskContainerDiv = document.createElement('div')
                //Le agregamos 
                taskParagraph.innerText = task.name
                deleteTaskBtn.setAttribute('id',task._id)
                deleteTaskBtn.addEventListener('click', (e)=>{
                    
                    const taskId = task._id
                    deleteTaskBtn.innerText = '...'
                    fetch(`${baseBackendUrl}/tasks/${taskId}`,{
                        method: 'DELETE',

                    }).then(()=>{
                        const taskDiv = deleteTaskBtn.parentElement
                        taskDiv.remove()
                    })
                })
                taskParagraph.addEventListener('click',(e)=>{
                    input.value = task.name
                    createEditBtn.innerText = "Editar Tarea"
                    greenColor()
                    TASK_TO_EDIT = task
                })
                //Agregamos el párrafo al contenedor de tareas en el HTML
                taskContainerDiv.appendChild(taskParagraph)
                //Agregamos el botón de eleminación al párrafo
                taskContainerDiv.appendChild(deleteTaskBtn)
                tasksContainer.appendChild(taskContainerDiv)
            }
        })
}

getTasks()