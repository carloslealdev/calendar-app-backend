const express = require("express");
const { validationResult } = require("express-validator");

const validateFields = (req, res = express.response, next) => {
  //Manejo de errores
  const errors = validationResult(req);

  //Si el objeto errores NO está vacío
  if (!errors.isEmpty()) {
    //El return hace que no se ejecuten mas respuestas, solamente la del error
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};

module.exports = {
  validateFields,
};
