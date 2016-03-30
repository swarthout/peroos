'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('articles service', () => {
    it('registered the articles service', () => {
        assert.ok(app.service('articles'));
    });
});
