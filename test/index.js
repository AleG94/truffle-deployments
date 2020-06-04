'use strict';
const chai = require('chai');
const truffleDeployments = require('..');
const exporter = require('../lib/workers/exporter');
const importer = require('../lib/workers/importer');

chai.should();

describe('External API', () => {
  it('should expose export method', () => {
    truffleDeployments.export.should.be.equal(exporter.export);
  });

  it('should expose import method', () => {
    truffleDeployments.import.should.be.equal(importer.import);
  });
});
