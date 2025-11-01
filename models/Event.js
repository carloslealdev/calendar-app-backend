const { model, Schema } = require("mongoose");

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

//Esto solo para eliminar de la response de la api, el parámetro __v y sustituir el _id del evento solamente por id
EventSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

//En este caso generará una colección llamada Events
module.exports = model("Event", EventSchema);
