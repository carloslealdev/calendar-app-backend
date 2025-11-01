const express = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = express.response, next) => {
  //x-token es un header personalizado con el que voy a trabajar con mi JWT
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    //El método verify me devuelve el payload del JWT
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    (req.uid = uid), (req.name = name);
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token invalido",
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
