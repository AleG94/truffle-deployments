'use strict';
const chai = require('chai');
const sinon = require('sinon');
const { Command } = require('commander');
const importCmd = require('../../lib/commands/import');
const importer = require('../../lib/workers/importer');
const { DEFAULT_ARTIFACTS_DIR, DEFAULT_NETWORKS_DIR } = require('../../config/default');

chai.should();

module.exports = () => {
  afterEach(() => sinon.restore());

  it('should import with default dirs', () => {
    sinon.stub(importer, 'import');

    new Command()
      .addCommand(importCmd.build())
      .parse(['node', 'test.js', 'import']);

    const options = {};

    importer.import.calledWithMatch(DEFAULT_NETWORKS_DIR, DEFAULT_ARTIFACTS_DIR, options).should.be.true;
  });

  it('should import with custom dirs', () => {
    sinon.stub(importer, 'import');

    const artifactsDir = 'custom-artifacts-dir';
    const networksDir = 'custom-networks-dir';

    new Command()
      .addCommand(importCmd.build())
      .parse(['node', 'test.js', 'import', networksDir, artifactsDir]);

    const options = {};

    importer.import.calledWithMatch(networksDir, artifactsDir, options).should.be.true;
  });

  it('should import a single network (--network)', () => {
    sinon.stub(importer, 'import');

    const networkToImport = '4';

    new Command()
      .addCommand(importCmd.build())
      .parse(['node', 'test.js', 'import', '--network', networkToImport]);

    const options = { networks: [networkToImport] };

    importer.import.calledWithMatch(DEFAULT_NETWORKS_DIR, DEFAULT_ARTIFACTS_DIR, options).should.be.true;
  });
};
