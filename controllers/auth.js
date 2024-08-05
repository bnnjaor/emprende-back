const { transporter } = require("../helpers/mailer");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const getCode = async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email });
  
    if (!user) {
      // await User.create({email, firstname: 'Benjamin', lastname: 'Ormeño'})
      return res
        .status(400)
        .json({ ok: false, message: "No existe un usuario con ese correo" });
    }
  
    let code = "";
  
    for (let index = 0; index <= 5; index++) {
      let character = Math.floor(Math.random() * 9);
      code += character;
    }
  
    console.log({ code });
  
    user.login_code = code;
    await user.save();
  
    const result = await transporter.sendMail({
      from: `Benjamin Ormeño ${process.env.EMAIL}`,
      to: email,
      subject: "Codigo de inicio de sesion: " + code,
      body: "Este es tu codigo para iniciar sesion: ",
    });
    res.status(200).json({ ok: true, message: "codigo enviado con extio" });
  }

const login = async (req, res) => {
    const { email } = req.params;
  
    const { code } = req.body;
  
    const user = await User.findOne({ email, login_code: code });
  
    if (!user) {
      // await User.create({email, firstname: 'Benjamin', lastname: 'Ormeño'})
      return res
        .status(400)
        .json({ ok: false, message: "Credenciales invalidas" });
    }
  
    user.login_code = code;
    await user.save();
  
    const tokenPayload = {
      _id: user._id,
      firstname: user.firstname,
      email: user.email,
    };
  
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);
    console.log({ token });
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