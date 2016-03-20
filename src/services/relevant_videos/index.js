'use strict';

const hooks = require('./hooks');

extend = require('util')._extend,
watson = require('watson-developer-cloud'),
async  = require('async');

// if bluemix credentials exists, then override local
var credentials = extend({
username: '35801408-b49f-46b2-aa24-bb6b433275ba',
password: 'OuIuizFZHTPD',
version: 'v2'
}); // VCAP_SERVICES

var corpus_id = process.env.CORPUS_ID || '/corpora/public/TEDTalks';
var graph_id  = process.env.GRAPH_ID ||  '/graphs/wikipedia/en-20120601';

// Create the service wrapper
var conceptInsights = watson.concept_insights(credentials);

class Service {
  constructor(options = {}) {
    this.options = options;
  }

  find(params) {
    var text = params.query.text;
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if(Array.isArray(data)) {
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
    return Promise.resolve({ id });
  }
}


var conceptualSearch = function(req){
  var params = extend({ corpus: corpus_id, limit: 10 }, req.query);
  conceptInsights.corpora.getRelatedDocuments(params, function(err, data) {
    if (err)
      return err;
    else {
      async.parallel(data.results.map(getPassagesAsync), function(err, documentsWithPassages) {
        if (err)
          return err;
        else{
          data.results = documentsWithPassages;
          return data;
        }
      });
    }
  });
}

var extractConceptMentions = function(req){
  var params = extend({ graph: graph_id }, req.body);
  conceptInsights.graphs.annotateText(params, function(err, results) {
    if (err)
      return err;
    else
      return results;
  });
}

/**
 * Builds an Async function that get a document and call crop the passages on it.
 * @param  {[type]} doc The document
 * @return {[type]}     The document with the passages
 */
var getPassagesAsync = function(doc) {
  return function (callback) {
    conceptInsights.corpora.getDocument(doc, function(err, fullDoc) {
      if (err)
        callback(err);
      else {
        doc = extend(doc, fullDoc);
        doc.explanation_tags.forEach(crop.bind(this, doc));
        delete doc.parts;
        callback(null, doc);
      }
    });
  };
};

/**
 * Crop the document text where the tag is.
 * @param  {Object} doc The document.
 * @param  {Object} tag The explanation tag.
 */
var crop = function(doc, tag){
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

module.exports = function(){
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
