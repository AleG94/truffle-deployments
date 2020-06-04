'use strict';
const config = require('config');
const { Command } = require('commander');
const importer = require('../workers/importer');

const DEFAULT_ARTIFACTS_DIR = config.get('artifactsDir');
const DEFAULT_NETWORKS_DIR = config.get('networksDir');

const command = new Command()
  .command('import [networksDir] [artifactsDir]')
  .option('--network <network>', 'network id to import', value => value.split(' '))
  .description('imports contract addresses back to truffle artifacts')
  .action((networksDir, artifactsDir, cmd) => {
    importer.import(
      networksDir || DEFAULT_NETWORKS_DIR,
      artifactsDir || DEFAULT_ARTIFACTS_DIR,
      { networks: cmd.network }
    );
  });

module.exports = command;
