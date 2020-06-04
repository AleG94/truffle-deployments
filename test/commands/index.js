'use strict';
const importTest = require('./import.test');
const exportTest = require('./export.test');

describe('Commands', () => {
  describe('import', importTest);
  describe('export', exportTest);
});
