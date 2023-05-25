const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const {username, email, password} = req.body;
      const userData = await userService.registration(username, email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 60 * 1000, httpOnly: true}); // For https add flag ", secure: true"
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 60 * 1000, httpOnly: true}); // For https add flag ", secure: true"
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 60 * 1000, httpOnly: true}); // For https add flag ", secure: true"
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async blockUsers(req, res, next) {
    try {
      const { userIds } = req.body;
      const result = await userService.updateUserStatus(userIds, 'BLOCKED');
      if (userIds.includes(req.user.id)) {
        return res.json({...result, logoutRequired: true})
      }
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async unblockUsers(req, res, next) {
    try {
      const { userIds } = req.body;
      const result = await userService.updateUserStatus(userIds, 'ACTIVE');
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async deleteUsers(req, res, next) {
    try {
      const { userIds } = req.body;
      const result = await userService.deleteUsers(userIds);
      if (userIds.includes(req.user.id)) {
        return res.json({...result, logoutRequired: true})
      }
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();