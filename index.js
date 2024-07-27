require('dotenv').config()
const http = require('http');


function requestController(req,res){
    //logica de nuestra funcion
    console.log('Recibimos una nueva request')
}

const server = http.createServer(requestController)

const PORT = process.env.PORT

server.listen(PORT, function(){
    console.log(`El server está escuchando en el puerto ${PORT}`)
});