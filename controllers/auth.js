const { transporter } = require("../helpers/mailer");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const getCode = async (req, res) => {
    //Guardamos el email ingresado en una constante
    const { email } = req.params;
    
    //Buscamos al usuario en la base de datos por el email
    const user = await User.findOne({ email });
    //Si no hay usuarios retornamos un status 400
    if (!user) {
      //creamos un usuario con el email ingresado
      await User.create({email})
      return res
        .status(400)
        .json({ ok: false, message: "No existe un usuario con ese correo" });
    } 
    
    //creamos una variable code
    let code = "";
    //Ciclo for para que code tenga 6 digitos
    for (let index = 0; index <= 5; index++) {
      let character = Math.floor(Math.random() * 9);
      code += character;
    }
    

    //Le agregamos code como una propiedad al user
  
    user.login_code = code;
    await user.save();
  

    //Enviamos el codigo al correo del usuario usando nodemailer
    const result = await transporter.sendMail({
      from: `Benjamin Ormeño ${process.env.EMAIL}`,
      to: email,
      subject: "Codigo de inicio de sesion: " + code,
      body: "Este es tu codigo para iniciar sesion: ",
    });
    res.status(200).json({ ok: true, message: "codigo enviado con extio" });
  }

const login = async (req, res) => {
    //Se ingresan las credenciales
    const { email } = req.params;
    const { code } = req.body;

    //Corrobarmos las credenciales en la base de datos
    const user = await User.findOne({ email, login_code: code });

    if (!user) {
      return res
        .status(400)
        .json({ ok: false, message: "Credenciales invalidas" });
    }
  
    user.login_code = code;
    await user.save();
    console.log({user})

  
    //Generamos un tokenPayload con las credenciales del usuario

    const tokenPayload = {
      _id: user._id,
      firstname: user.firstname,
      email: user.email,
    };
  
    //Generamos el token con el tokenPayload + la llave secreta
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
    //Parseamos el token
    res.cookie("jwt", token);
  
    res.status(200).json({
      ok: true,
      data: tokenPayload,
      message: "Inicio de sesion exitoso",
    });
  }

module.exports = {
    getCode,
    login
}