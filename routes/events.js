/*
    Rutas de Eventos 
    host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} = require("../controllers/events");
const { validateJWT } = require("../middlewares/validateJWT");
const { validateFields } = require("../middlewares/validateFields");
const { isDate } = require("../helpers/isDate");

const router = Router();

//Todas las rutas deben utilizar el middleware para validar JWT
router.use(validateJWT);

//Obtener eventos
router.get("/", getEvents);

//Crear un nuevo evento
router.post(
  "/",
  [
    //Establezco que el title es un campo obligatorio
    check("title", "El título es obligatorio").not().isEmpty(),

    //Como no hay manera nativa de chequear la fecha entonces uso el método .custom()
    //para una validación personalizada
    check("start", "Fecha de inicio es obligatoria").custom(isDate),

    check("end", "Fecha de finalización es obligatoria").custom(isDate),

    validateFields,
  ],
  createEvent
);

//Actualizar evento
router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalización es obligatoria").custom(isDate),
    validateFields,
  ],
  updateEvent
);

//Eliminar evento
router.delete("/:id", deleteEvent);
module.exports = router;
