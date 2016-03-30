'use strict';

const hooks = require('./hooks');

const extend = require('util')._extend;
const watson = require('watson-developer-cloud');
const async = require('async');

// if bluemix credentials exists, then override local
var credentials = extend({
    username: process.env.BLUEMIX_USERNAME || "",
    password: process.env.BLUEMIX_PW || "",
    version: 'v2'
}); // VCAP_SERVICES

var corpus_id = process.env.CORPUS_ID || '/corpora/public/TEDTalks';
var graph_id = process.env.GRAPH_ID || '/graphs/wikipedia/en-20120601';

// Create the service wrapper
var conceptInsights = watson.concept_insights(credentials);

class Service {
    constructor(options = {}) {
        this.options = options;
    }

    find(params) {
        var text = params.query.text;
        return Promise.resolve(getAbstractConcepts(text));
    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current)));
        }

        return Promise.resolve(data);
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({id});
    }
}

function getAbstractConcepts(text) {
    let final_results = [];
    text = text.length > 0 ? text : ' ';
    return extractConceptMentions({
        text: text
    })
        .then(function (results) {
            // console.log("results: ",results);
            var unique_concept_array = [];

            for (var i = 0; i < results.annotations.length; i++) {
                if (!(check_duplicate_concept(unique_concept_array, results.annotations[i].concept.id) || unique_concept_array.length == 3))
                    unique_concept_array.push(results.annotations[i].concept.id);
            }

            // console.log("unique_concept_array: ", unique_concept_array);
            if (unique_concept_array.length > 0) {

                return conceptualSearch({
                    ids: unique_concept_array,
                    limit: 3
                }).then(function (final) {
                    console.log(final);
                    return final;
                })
            }
            return [];

        })
}

function check_duplicate_concept(unique_concept_array, concept) {
    for (var i = 0; i < unique_concept_array.length; i++) {
        if (unique_concept_array[i] == concept)
            return true;
    }
    return false;
}


var conceptualSearch = function (query) {
    // console.log("got into conceptualSearch");
    return new Promise(function (resolve, reject) {
        var params = extend({corpus: corpus_id, limit: 10}, query);
        conceptInsights.corpora.getRelatedDocuments(params, function (err, data) {
                if (err) {
                    return reject(err);
                }
                // console.log("data.results: ",data.results);
                resolve(Promise.all(data.results.map(getPassagesAsync)).then((results)=> {
                    // console.log("*******passages async multiple: ", results);
                    let videoData = results.map((result) => result.user_fields);
                    // console.log("*************video data: ", videoData);

                    return (videoData);
                }))

            }
        );
    });
};


var extractConceptMentions = function (data) {
    return new Promise(function (resolve, reject) {
        var params = extend({graph: graph_id}, data);
        conceptInsights.graphs.annotateText(params, function (err, results) {
            if (err)
                return reject(err);
            resolve(results);
        });
    });
}

/**
 * Builds an Async function that get a document and call crop the passages on it.
 * @param  {[type]} doc The document
 * @return {[type]}     The document with the passages
 */
var getPassagesAsync = function (doc) {
    return new Promise(function (resolve, reject) {
        conceptInsights.corpora.getDocument(doc, function (err, fullDoc) {
            if (err) {
                return reject(err);
            }
            doc = extend(doc, fullDoc);
            doc.explanation_tags.forEach(crop.bind(this, doc));
            delete doc.parts;
            resolve(doc);
        });
    });
};

/**
 * Crop the document text where the tag is.
 * @param  {Object} doc The document.
 * @param  {Object} tag The explanation tag.
 */
var crop = function (doc, tag) {
    var textIndexes = tag.text_index;
    var documentText = doc.parts[tag.parts_index].data;

    var anchor = documentText.substring(textIndexes[0], textIndexes[1]);
    var leftIndex = Math.max(textIndexes[0] - 100, 0);
    var rightIndex = Math.min(textIndexes[1] + 100, documentText.length);

    var prefix = documentText.substring(leftIndex, textIndexes[0]);
    var suffix = documentText.substring(textIndexes[1], rightIndex);

    var firstSpace = prefix.indexOf(' ');
    if ((firstSpace !== -1) && (firstSpace + 1 < prefix.length))
        prefix = prefix.substring(firstSpace + 1);

    var lastSpace = suffix.lastIndexOf(' ');
    if (lastSpace !== -1)
        suffix = suffix.substring(0, lastSpace);

    tag.passage = '...' + prefix + '<b>' + anchor + '</b>' + suffix + '...';
};

module.exports = function () {
    const app = this;

    // Initialize our service with any options it requires
    app.use('/relevant_videos', new Service());

    // Get our initialize service to that we can bind hooks
    const relevant_videosService = app.service('/relevant_videos');

    // Set up our before hooks
    relevant_videosService.before(hooks.before);

    // Set up our after hooks
    relevant_videosService.after(hooks.after);
};

module.exports.Service = Service;
