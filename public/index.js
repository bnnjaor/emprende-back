const http = require('http');

function requestController(req,res){
    //logica de nuestra funcion
    console.log('Recibimos una nueva request')
}

const server = http.createServer(requestController)

server.listen(3000, () => {
    console.log('El server está escuchando en el puerto 3000')
});