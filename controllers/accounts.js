'use strict';

const userstore = require('../models/user-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('playlist', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    user.picture = request.files.picture;
    logger.info(`registering ${user.email}`);
    userstore.addUser(user, function () {
      response.redirect('/login');
    });
  },
  
  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user && request.body.password === user.password) {
      response.cookie('playlist', user.email);
      logger.info('logging in' + user.email);
      response.redirect('/start');
    } else {
      response.redirect('/login');
    }
  },

  getCurrentUser (request) {
    const userEmail = request.cookies.playlist;
    return userstore.getUserByEmail(userEmail);
  }
}

module.exports = accounts;