'use strict';
const fs = require('fs');
const path = require('path');

exports.export = (artifactsDir, networksDir, options = {}) => {
  const artifactsPath = path.join(process.cwd(), artifactsDir);
  const networksPath = path.join(process.cwd(), networksDir);

  if (!fs.existsSync(artifactsPath)) {
    throw Error('Invalid artifacts directory');
  }

  const contracts = fs.readdirSync(artifactsPath).map(e => e.replace('.json', ''));

  const networksData = {};

  for (const contract of contracts) {
    const contractPath = path.join(artifactsPath, contract + '.json');
    const artifact = JSON.parse(fs.readFileSync(contractPath));

    for (const network in artifact.networks) {
      if (!networksData[network]) {
        networksData[network] = [];
      }

      if (artifact.networks[network]) {
        networksData[network].push({
          contract: artifact.contractName,
          address: artifact.networks[network].address,
          transactionHash: artifact.networks[network].transactionHash
        });
      }
    }
  }

  if (!fs.existsSync(networksPath)) {
    fs.mkdirSync(networksPath);
  }

  const deployedNetworks = Object.keys(networksData);
  const networksToExport = options.networks ? options.networks.map(e => e.toString()) : deployedNetworks;

  if (!networksToExport.length) {
    console.log('No networks to export.');
  }

  for (const network of networksToExport) {
    if (!networksData[network] || networksData[network].length === 0) {
      console.log('No deployments found for network ' + network + '.');
      continue;
    }

    const networkPath = path.join(networksPath, network + '.json');

    if (options.reset || !fs.existsSync(networkPath)) {
      fs.writeFileSync(networkPath, JSON.stringify(networksData[network], null, 2));
    } else {
      const networkData = JSON.parse(fs.readFileSync(networkPath));

      for (const deploy of networksData[network]) {
        const index = networkData.findIndex(e => e.contract === deploy.contract);

        if (index === -1) {
          networkData.push(deploy);
        } else {
          networkData[index].address = deploy.address;
          networkData[index].transactionHash = deploy.transactionHash;
        }
      }

      fs.writeFileSync(networkPath, JSON.stringify(networkData, null, 2));
    }

    console.log('Network ' + network + ' was successfully exported.');
  }
};
