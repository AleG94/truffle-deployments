'use strict';
const config = require('config');
const chai = require('chai');
const sinon = require('sinon');
const { Command } = require('commander');
const exportCmd = require('../../lib/commands/export');
const exporter = require('../../lib/workers/exporter');

chai.should();

const DEFAULT_ARTIFACTS_DIR = config.get('artifactsDir');
const DEFAULT_NETWORKS_DIR = config.get('networksDir');

module.exports = () => {
  const program = new Command().addCommand(exportCmd);

  afterEach(() => sinon.restore());

  it('should export with default dirs', () => {
    sinon.stub(exporter, 'export');

    program.parse(['node', 'test.js', 'export']);

    const options = { networks: undefined };

    exporter.export.calledWithMatch(DEFAULT_ARTIFACTS_DIR, DEFAULT_NETWORKS_DIR, options).should.be.true;
  });

  it('should export with custom dirs', () => {
    sinon.stub(exporter, 'export');

    const artifactsDir = 'custom-artifacts-dir';
    const networksDir = 'custom-networks-dir';

    program.parse(['node', 'test.js', 'export', artifactsDir, networksDir]);

    const options = { networks: undefined };

    exporter.export.calledWithMatch(artifactsDir, networksDir, options).should.be.true;
  });

  it('should export a single network (-n)', () => {
    sinon.stub(exporter, 'export');

    const networkToExport = '4';

    program.parse(['node', 'test.js', 'export', '-n', networkToExport]);

    const options = { networks: [networkToExport] };

    exporter.export.calledWithMatch(DEFAULT_ARTIFACTS_DIR, DEFAULT_NETWORKS_DIR, options).should.be.true;
  });

  it('should export a single network (--network)', () => {
    sinon.stub(exporter, 'export');

    const networkToExport = '4';

    program.parse(['node', 'test.js', 'export', '--network', networkToExport]);

    const options = { networks: [networkToExport] };

    exporter.export.calledWithMatch(DEFAULT_ARTIFACTS_DIR, DEFAULT_NETWORKS_DIR, options).should.be.true;
  });
};
