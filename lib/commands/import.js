'use strict';
const { Command } = require('commander');
const config = require('../../config/default');
const importer = require('../workers/importer');

exports.build = () => new Command()
  .command('import [networksDir] [artifactsDir]')
  .option('-n, --network <network>', 'network id to import', value => value.split(' '))
  .description('imports contract addresses back to truffle artifacts')
  .action((networksDir, artifactsDir, cmd) => {
    importer.import(
      networksDir || config.DEFAULT_NETWORKS_DIR,
      artifactsDir || config.DEFAULT_ARTIFACTS_DIR,
      { networks: cmd.network }
    );
  });
