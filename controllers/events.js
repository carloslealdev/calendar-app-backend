/**
 * @type {import('mongoose').Model<any>}
 */

const express = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = express.response) => {
  //Traigo los eventos de la base de datos y con el metodo .populate(), relleno los datos que necesito
  //del parametro user de cada event(el _id del user siempre va a venir por defecto)
  const events = await Event.find().populate("user", "name");

  res.json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = express.reponse) => {
  //Creo la instacia de mi esquema evento con la información del body de la request
  const event = Event(req.body);

  try {
    //Establezco el user del evento con el id que tengo almacenado en la req.id gracias al TOKEN que paso el header y al validateJWT
    event.user = req.uid;

    const eventSaved = await event.save();

    res.json({
      ok: true,
      event: eventSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comunicarse con el administrador",
    });
  }
};

const updateEvent = async (req, res = express.reponse) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese Id",
      });
    }

    //Validación para evitar que un usuario distinto al dueño del JWT que se provee, edite un evento
    //que no le pertenece
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    //Creo el nuevo evento con el body de la request y le agrego los datos del user que lo edita
    const newEvent = {
      ...req.body,
      user: uid,
    };

    //Proporciono el id del evento a actualizar y la nueva data al método .findByIdAndUpdate()
    // de la instancia Event para guardar el nuevo evento
    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      event: eventUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req, res = express.reponse) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe por ese Id",
      });
    }

    //Validación para evitar que un usuario distinto al dueño del JWT que se provee, elimine un evento
    //que no le pertenece
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
      msg: "Evento eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
