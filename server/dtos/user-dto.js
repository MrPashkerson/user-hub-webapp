module.exports = class UserDto {
  id;
  username;
  email;
  registrationDate;
  lastLogin;
  status;

  constructor(model) {
    this.id = model._id;
    this.username = model.username;
    this.email = model.email;
    this.registrationDate = model.registrationDate;
    this.lastLogin = model.lastLogin;
    this.status = model.status;
  }
}