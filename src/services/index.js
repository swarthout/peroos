'use strict';
const articles = require('./articles');
const keywords = require('./keywords');
const summary = require('./summary');

module.exports = function() {
  const app = this;

  app.configure(summary);
  app.configure(keywords);
  app.configure(articles);
};
