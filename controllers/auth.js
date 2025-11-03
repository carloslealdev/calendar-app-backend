const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

//Defino res = express.response para poder tener la ayuda de intelisense
const createUser = async (req, res = express.response) => {
  const { email, password } = req.body;

  try {
    //Validamos con mongoose si ya existe un user con el email que intentamos registrar
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese correo",
      });
    }

    //Creamos una instacia del esquema de usuario que defini en mis modelos y le paso
    //los datos de la request
    user = new User(req.body);

    //Encriptar contraseña
    //Generamos un salt con bcrypt
    const salt = bcrypt.genSaltSync();
    //Generamos el hash con el password y el salt
    user.password = bcrypt.hashSync(password, salt);

    //Guardo el user en la base de datos
    await user.save();

    //Generara JWT
    const token = await generateJWT(user.id, user.name);

    //Devuelvo la siguiente respuesta si la promesa del save() sale bien
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hablar con el administrador",
    });
  }
};

const loginUser = async (req, res = express.response) => {
  const { email, password } = req.body;

  try {
    //Validamos si existe un usuario con el email que se intenta logear
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario registrado con ese email",
      });
    }

    //Confirmar los passwords
    //Comparamos con bcrypt el password que se está ingresando y el hash que está almacenado
    //en la base de datos (user.password)
    //Esto devuelve true o false
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    //Generar nuestro JWT
    const token = await generateJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hablar con el administrador",
    });
  }
};

const revalidateToken = async (req, res = express.response) => {
  //Estos uid y name en la request se están estableciendo cuando valido el JWT (validateJWT)
  const uid = req.uid;
  const name = req.name;

  //Generar un nuevo JWT y retornarlo en la petición
  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = { createUser, loginUser, revalidateToken };
