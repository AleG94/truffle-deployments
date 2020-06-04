'use strict';
const fs = require('fs');
const fsExtra = require('fs-extra');
const chai = require('chai');
const path = require('path');
const exporter = require('../../lib/workers/exporter');

chai.should();

const SANDBOX_CONTENT_DIR = 'test/fixtures/export';
const SANDBOX_WORKING_DIR = 'test/sandbox';
const ARTIFACTS_DIR = path.join(SANDBOX_WORKING_DIR, 'build/contracts');
const NETWORKS_DIR = path.join(SANDBOX_WORKING_DIR, 'networks');
const ARTIFACT_FILE_PATH = path.join(process.cwd(), ARTIFACTS_DIR, 'Ownable.json');

module.exports = () => {
  const networksData = {
    1: [
      {
        contract: 'Ownable',
        address: '0x650F0003fBfc496Ed222Fdca33b19F9FcEAF326e',
        transactionHash: '0x5559fbb881b502397078d0f632bc50a77b80e36a826dc0b081ccd577b8cde9ce'
      }
    ],
    4: [
      {
        contract: 'Ownable',
        address: '0x7e1ca7c76c62700d19b5cDBdcc0CA643C2dF1610',
        transactionHash: '0x3fa8fc33b569da383991cb595fe580ccbfd7e6a889ae9ef4e83c79a857b5dcbf'
      }
    ]
  };

  beforeEach(() => {
    fsExtra.copySync(path.join(process.cwd(), SANDBOX_CONTENT_DIR), path.join(process.cwd(), SANDBOX_WORKING_DIR));
  });

  afterEach(() => {
    fs.rmdirSync(path.join(process.cwd(), SANDBOX_WORKING_DIR), { recursive: true });
  });

  it('should export all networks', () => {
    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));

    exporter.export(ARTIFACTS_DIR, NETWORKS_DIR);

    for (const network in artifact.networks) {
      const networkPath = path.join(process.cwd(), NETWORKS_DIR, network + '.json');
      const output = JSON.parse(fs.readFileSync(networkPath));

      output.should.be.deep.equal(networksData[network]);
    }
  });

  it('should export a single network', () => {
    const artifact = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));
    const networkToExport = 4;
    const options = { networks: [networkToExport] };

    exporter.export(ARTIFACTS_DIR, NETWORKS_DIR, options);

    for (const network in artifact.networks) {
      const networkPath = path.join(process.cwd(), NETWORKS_DIR, network + '.json');

      if (network === networkToExport.toString()) {
        const output = JSON.parse(fs.readFileSync(networkPath));

        output.should.be.deep.equal(networksData[network]);
      } else {
        fs.existsSync(networkPath).should.be.false;
      }
    }
  });

  it('should not export a non-deployed network', () => {
    const networkToExport = 0;
    const options = { networks: [networkToExport] };

    exporter.export(ARTIFACTS_DIR, NETWORKS_DIR, options);

    const networkFiles = fs.readdirSync(NETWORKS_DIR);

    networkFiles.length.should.be.equal(0);
  });

  it('should throw if artifacts directory is invalid', () => {
    const invalidArtifactsPath = 'invalid/path';

    const fn = () => exporter.export(invalidArtifactsPath, NETWORKS_DIR);

    fn.should.throw('Invalid artifacts directory');
  });
};
