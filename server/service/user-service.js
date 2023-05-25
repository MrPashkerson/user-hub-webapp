const bcrypt = require('bcrypt');
const userModel = require('../models/user-model')
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
  async registration(username, email, password) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
        throw ApiError.BadRequest(`Account with email address ${email} already exists!`)
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({username, email, password: hashedPassword});
    user.lastLogin = new Date();
    await user.save();
    const userDto = new UserDto(user); // id, username, email, registrationDate, lastLogin, status
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: UserDto
    }
  }

  async login(email, password) {
    const user = await userModel.findOne({email});
    if (!user) {
      throw ApiError.BadRequest('Email not found');
    }
    if (user.status === "BLOCKED") {
      throw ApiError.BadRequest('You are blocked');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Password incorrect')
    }
    user.lastLogin = new Date();
    await user.save();
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: UserDto
    }
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: UserDto
    }
  }

  async getAllUsers() {
    return userModel.find();
  }

  async updateUserStatus(userIds, status) {
    try {
      let validUserIds = [];
      let errorMessages = [];

      for (let id of userIds) {
        const user = await userModel.findById(id);
        if (!user) {
          const error = `User with id ${id} does not exist`;
          errorMessages.push({ status: 401, message: error });
          continue;
        }
        validUserIds.push(id);
      }
      await userModel.updateMany(
          { _id: { $in: validUserIds } },
          { $set: { status: status } }
      );
      if (status === 'BLOCKED') {
        await tokenService.removeTokensByUser(validUserIds);
      }
      return errorMessages.length > 0 ? errorMessages : { };
    } catch (e) {
      throw e;
    }
  }

  async deleteUsers(userIds) {
    let validUserIds = [];
    let errorMessages = [];

    for (let id of userIds) {
      const user = await userModel.findById(id);
      if (!user) {
        const error = `User with id ${id} does not exist`;
        errorMessages.push({ status: 401, message: error });
        continue;
      }
      validUserIds.push(id);
    }
    await userModel.deleteMany(
        { _id: { $in: validUserIds } },
    );
    await tokenService.removeTokensByUser(validUserIds);
    return errorMessages.length > 0 ? errorMessages : { };
  }
}

module.exports = new UserService();