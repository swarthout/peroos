'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('keywords service', () => {
    it('registered the keywords service', () => {
        assert.ok(app.service('keywords'));
    });
});
