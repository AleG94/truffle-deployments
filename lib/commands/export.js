'use strict';
const config = require('config');
const { Command } = require('commander');
const exporter = require('../workers/exporter');

const DEFAULT_ARTIFACTS_DIR = config.get('artifactsDir');
const DEFAULT_NETWORKS_DIR = config.get('networksDir');

exports.build = () => new Command()
  .command('export [artifactsDir] [networksDir]')
  .option('-n, --network <network>', 'network id to export', value => value.split(' '))
  .description('exports contract addresses from truffle artifacts')
  .action((artifactsDir, networksDir, cmd) => {
    exporter.export(
      artifactsDir || DEFAULT_ARTIFACTS_DIR,
      networksDir || DEFAULT_NETWORKS_DIR,
      { networks: cmd.network }
    );
  });
