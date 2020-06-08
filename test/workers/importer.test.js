'use strict';
const fs = require('fs');
const fsExtra = require('fs-extra');
const chai = require('chai');
const path = require('path');
const importer = require('../../lib/workers/importer');

chai.should();

const SANDBOX_CONTENT_DIR = 'test/fixtures/import';
const SANDBOX_WORKING_DIR = 'test/sandbox';
const ARTIFACTS_DIR = path.join(SANDBOX_WORKING_DIR, 'build/contracts');
const NETWORKS_DIR = path.join(SANDBOX_WORKING_DIR, 'networks');
const ARTIFACT_FILE_PATH = path.join(process.cwd(), ARTIFACTS_DIR, 'Ownable.json');

module.exports = () => {
  const artifact = {
    contractName: 'Ownable',
    networks: {
      1: {
        events: {},
        links: {},
        address: '0x650F0003fBfc496Ed222Fdca33b19F9FcEAF326e',
        transactionHash: '0x5559fbb881b502397078d0f632bc50a77b80e36a826dc0b081ccd577b8cde9ce'
      },
      4: {
        events: {},
        links: {},
        address: '0x7e1ca7c76c62700d19b5cDBdcc0CA643C2dF1610',
        transactionHash: '0x3fa8fc33b569da383991cb595fe580ccbfd7e6a889ae9ef4e83c79a857b5dcbf'
      }
    }
  };

  beforeEach(() => {
    fsExtra.copySync(path.join(process.cwd(), SANDBOX_CONTENT_DIR), path.join(process.cwd(), SANDBOX_WORKING_DIR));
  });

  afterEach(() => {
    fs.rmdirSync(path.join(process.cwd(), SANDBOX_WORKING_DIR), { recursive: true });
  });

  it('should import all networks', () => {
    importer.import(NETWORKS_DIR, ARTIFACTS_DIR);

    const data = fs.readFileSync(ARTIFACT_FILE_PATH);
    const output = JSON.parse(data);

    output.should.be.deep.equal(artifact);
  });

  it('should import a single network', () => {
    const networkToImport = 4;
    const options = { networks: [networkToImport] };

    importer.import(NETWORKS_DIR, ARTIFACTS_DIR, options);

    const output = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));

    const artifactWithImportedNetwork = Object.assign(artifact, {
      networks: {
        [networkToImport]: artifact.networks[networkToImport]
      }
    });

    output.should.be.deep.equal(artifactWithImportedNetwork);
  });

  it('should not import a non-exported network', () => {
    const initialArtifact = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));
    const networkToImport = 0;
    const options = { networks: [networkToImport] };

    importer.import(NETWORKS_DIR, ARTIFACTS_DIR, options);

    const finalArtifact = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));

    finalArtifact.should.be.deep.equal(initialArtifact);
  });

  it('should not import any network when an empty networks array is provided', () => {
    const initialArtifact = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));
    const options = { networks: [] };

    importer.import(ARTIFACTS_DIR, NETWORKS_DIR, options);

    const finalArtifact = JSON.parse(fs.readFileSync(ARTIFACT_FILE_PATH));

    finalArtifact.should.be.deep.equal(initialArtifact);
  });

  it('should throw if networks directory is invalid', () => {
    const invalidNetworksPath = 'invalid/path';

    const fn = () => importer.import(invalidNetworksPath, ARTIFACTS_DIR);

    fn.should.throw('Invalid networks directory');
  });

  it('should throw if artifacts directory is invalid', () => {
    const invalidArtifactsPath = 'invalid/path';

    const fn = () => importer.import(NETWORKS_DIR, invalidArtifactsPath);

    fn.should.throw('Invalid artifacts directory');
  });
};
