'use strict';
const relevant_videos = require('./relevant_videos');
const summary = require('./summary');

module.exports = function () {
    const app = this;

    app.configure(summary);
    app.configure(relevant_videos);
};
