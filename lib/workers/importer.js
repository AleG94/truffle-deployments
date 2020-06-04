'use strict';
const fs = require('fs');
const path = require('path');

exports.import = (networksDir, artifactsDir, options = {}) => {
  const networksPath = path.join(process.cwd(), networksDir);
  const artifactsPath = path.join(process.cwd(), artifactsDir);

  if (!fs.existsSync(networksPath)) {
    throw Error('Invalid networks directory');
  }
  if (!fs.existsSync(artifactsPath)) {
    throw Error('Invalid artifacts directory');
  }

  const exportedNetworks = fs.readdirSync(networksPath).map(e => e.replace('.json', ''));
  const networksToImport = options.networks ?
    exportedNetworks.filter(e => options.networks.map(e => e.toString()).includes(e)) : exportedNetworks;

  if (!networksToImport.length) {
    console.log('No networks to import.');
  }

  for (const network of networksToImport) {
    const networkPath = path.join(networksPath, network + '.json');
    const networkData = JSON.parse(fs.readFileSync(networkPath));

    for (const deploy of networkData) {
      const artifactPath = path.join(artifactsPath, deploy.contract + '.json');

      if (fs.existsSync(artifactPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactPath));

        artifact.networks[network] = {
          events: {},
          links: {},
          address: deploy.address,
          transactionHash: deploy.transactionHash
        };

        fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
      }
    }

    console.log('Network ' + network + ' successfully imported.');
  }
};
