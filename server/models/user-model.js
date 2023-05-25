const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  registrationDate: {type: Date, default: Date.now},
  lastLogin: Date,
  status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE'},
})

module.exports = model('User', UserSchema);