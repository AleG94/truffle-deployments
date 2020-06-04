'use strict';
const importerTest = require('./importer.test');
const exporterTest = require('./exporter.test');

describe('Workers', () => {
  describe('importer', importerTest);
  describe('exporter', exporterTest);
});
