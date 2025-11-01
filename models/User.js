const { model, Schema } = require("mongoose");

//Esto determina la estructura de los users que voy a guardar en la base de datos
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//Mongo interpreta el nombre del modelo que estamos pasando y crea una colección con relación a ese nombre
//En este caso generará una colección llamada Users
module.exports = model("User", UserSchema);
