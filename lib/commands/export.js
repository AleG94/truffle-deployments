'use strict';
const { Command } = require('commander');
const config = require('../../config/default');
const exporter = require('../workers/exporter');

exports.build = () => new Command()
  .command('export [artifactsDir] [networksDir]')
  .option('-n, --network <network>', 'network id to export', value => value.split(' '))
  .option('-r, --reset', 'delete old deployments')
  .description('exports contract addresses from truffle artifacts')
  .action((artifactsDir, networksDir, cmd) => {
    exporter.export(
      artifactsDir || config.DEFAULT_ARTIFACTS_DIR,
      networksDir || config.DEFAULT_NETWORKS_DIR,
      { networks: cmd.network, reset: cmd.reset }
    );
  });
