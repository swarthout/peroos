'use strict';
const articles = require('./articles');
const keywords = require('./keywords');
const summary = require('./summary');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(summary);
  app.configure(keywords);
  app.configure(articles);
};
