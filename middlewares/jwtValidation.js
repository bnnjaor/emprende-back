const jwt = require('jsonwebtoken');

const jwtValidation = (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      const validPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      next();
  
    } catch (error) {
      res.status(401).json({ ok: false, message: "Ivalid Token" });
    }
  }

  module.exports = {jwtValidation};