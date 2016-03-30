'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('relevant_videos service', () => {
    it('registered the relevant_videos service', () => {
        assert.ok(app.service('relevant_videos'));
    });
});
