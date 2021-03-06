'use strict';

const hooks = require('./hooks');
const rp = require('request-promise');
class Service {
    constructor(options = {}) {
        this.options = options;
    }

    find(params) {
        let req_url = params.query.url;
        let api_key = process.env.SMMRY_API_KEY || "";
        let smmry_url = `http://api.smmry.com?SM_API_KEY=${api_key}&SM_URL=${req_url}`;
        let summary = "";
        return rp(smmry_url).then((data) => {
            let data_obj = JSON.parse(data);
            return data_obj.sm_api_content;
        })
    }
}

module.exports = function () {
    const app = this;

    // Initialize our service with any options it requires
    app.use('/summaries', new Service());

    // Get our initialize service to that we can bind hooks
    const summaryService = app.service('/summaries');

    // Set up our before hooks
    summaryService.before(hooks.before);

    // Set up our after hooks
    summaryService.after(hooks.after);
};

module.exports.Service = Service;
