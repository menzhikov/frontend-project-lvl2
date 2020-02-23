#!/usr/bin/env node

import program from 'commander';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format [type]', 'output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(firstConfig);
    console.log(secondConfig);
  });

program.parse(process.argv);
