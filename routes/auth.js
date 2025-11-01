/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const {
  createUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

//Puedo pasar como segundo argumento un middleware o un arreglo de varios middlewares
router.post(
  "/new",
  [
    //Middlewares
    //Establezco que el parametro name es obligatorio y que no debe estar vacío y mando un mensaje de error
    check("name", "El nombre es obligatorio").not().isEmpty(),

    //Validación para que el correo sea obligatorio y válido
    check("email", "El email es obligatorio").isEmail(),

    //Validación para password obligatorio y mayor a 6 caracteres
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),

    //Custom Middleware
    validateFields,
  ],
  createUser
);

router.post(
  "/",
  [
    //Middlewares

    //Validación para que el correo sea obligatorio y válido
    check("email", "El email es obligatorio").isEmail(),

    //Validación para password obligatorio y mayor a 6 caracteres
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    //Custom Middleware
    validateFields,
  ],
  loginUser
);

router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
