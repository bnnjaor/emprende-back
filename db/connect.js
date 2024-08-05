const mongoose = require("mongoose");

//Conectar a MongoDB

const dbConnect = ()=>{
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("Conectado a MongoDB");
      })
      .catch((err) => {
        console.error("Error al conectar a MongoDB", { err });
      });

}


  module.exports = dbConnect