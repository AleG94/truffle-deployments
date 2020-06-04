'use strict';
const config = require('config');
const chai = require('chai');
const sinon = require('sinon');
const { Command } = require('commander');
const importCmd = require('../../lib/commands/import');
const importer = require('../../lib/workers/importer');

chai.should();

const DEFAULT_ARTIFACTS_DIR = config.get('artifactsDir');
const DEFAULT_NETWORKS_DIR = config.get('networksDir');

module.exports = () => {
  const program = new Command().addCommand(importCmd);

  afterEach(() => sinon.restore());

  it('should import with default dirs', () => {
    sinon.stub(importer, 'import');

    program.parse(['node', 'test.js', 'import']);

    const options = { networks: undefined };

    importer.import.calledWithMatch(DEFAULT_NETWORKS_DIR, DEFAULT_ARTIFACTS_DIR, options).should.be.true;
  });

  it('should import with custom dirs', () => {
    sinon.stub(importer, 'import');

    const artifactsDir = 'custom-artifacts-dir';
    const networksDir = 'custom-networks-dir';

    program.parse(['node', 'test.js', 'import', networksDir, artifactsDir]);

    const options = { networks: undefined };

    importer.import.calledWithMatch(networksDir, artifactsDir, options).should.be.true;
  });

  it('should import a single network (--network)', () => {
    sinon.stub(importer, 'import');

    const networkToImport = '4';

    program.parse(['node', 'test.js', 'import', '--network', networkToImport]);

    const options = { networks: [networkToImport] };

    importer.import.calledWithMatch(DEFAULT_NETWORKS_DIR, DEFAULT_ARTIFACTS_DIR, options).should.be.true;
  });
};