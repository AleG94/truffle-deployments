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
        contract: 'Token',
        address: '0xb56c770c2fa5222947a9e3c5beb8dc46dd656b5f',
        transactionHash: '0xe31509629b75866917ab387751a75b737b973622d9765af69b557bde038e1210'
      },
      {
        contract: 'Ownable',
        address: '0x650F0003fBfc496Ed222Fdca33b19F9FcEAF326e',
        transactionHash: '0x5559fbb881b502397078d0f632bc50a77b80e36a826dc0b081ccd577b8cde9ce'
      }
    ],
    2: [
      {
        contract: 'Token',
        address: '0xb56c770c2fa5222947a9e3c5beb8dc46dd656b5f',
        transactionHash: '0xe31509629b75866917ab387751a75b737b973622d9765af69b557bde038e1210'
      },
      {
        contract: 'Ownable',
        address: '0xFe905B0a8938168eEB79D771c28822FC2c5d9E9E',
        transactionHash: '0xeb51fb88f26683ccc0a527936667c606b6f05e6d56d7a3dba759bd8678c3d74b'
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
    const networkToExport = 1;
    const options = { networks: [networkToExport] };

    exporter.export(ARTIFACTS_DIR, NETWORKS_DIR, options);

    const networkPath = path.join(process.cwd(), NETWORKS_DIR, networkToExport + '.json');
    const output = JSON.parse(fs.readFileSync(networkPath));

    output.should.be.deep.equal(networksData[networkToExport]);
  });

  it('should not export a non-deployed network', () => {
    const networkToExport = 0;
    const options = { networks: [networkToExport] };

    exporter.export(ARTIFACTS_DIR, NETWORKS_DIR, options);

    const networkPath = path.join(NETWORKS_DIR, networkToExport + '.json');

    fs.existsSync(networkPath).should.be.false;
  });

  it('should throw if artifacts directory is invalid', () => {
    const invalidArtifactsPath = 'invalid/path';

    const fn = () => exporter.export(invalidArtifactsPath, NETWORKS_DIR);

    fn.should.throw('Invalid artifacts directory');
  });

  it('should create networks dir if it does not exist', () => {
    const nonExistentNetworksDir = path.join(SANDBOX_WORKING_DIR, 'non-existent-dir');

    exporter.export(ARTIFACTS_DIR, nonExistentNetworksDir);

    fs.existsSync(nonExistentNetworksDir).should.be.true;
  });
};
