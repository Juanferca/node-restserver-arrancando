const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}  no es un error válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']

    },
    password: {
        type: String,
        required: [true, 'Contraseña necesaria']
    },
    img: {
        type: String,
        required: false
    }, // No es obligatorio
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos // default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    }, // Boolean
    google: {
        type: Boolean,
        default: false // Boolean
    }

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);