'use strict';
const relevant_videos = require('./relevant_videos');
const articles = require('./articles');
const keywords = require('./keywords');
const summary = require('./summary');

module.exports = function () {
    const app = this;

    app.configure(summary);
    app.configure(keywords);
    app.configure(articles);
    app.configure(relevant_videos);
};
