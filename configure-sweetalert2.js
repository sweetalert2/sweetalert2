#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Define CLI arguments
const argv = yargs(hideBin(process.argv))
  .option('country', {
    type: 'string',
    describe: 'Target country for the anti-war message',
    demandOption: false,
  })
  .option('message', {
    type: 'string',
    describe: 'Custom anti-war message',
    demandOption: false,
  })
  .option('videoURL', {
    type: 'string',
    describe: 'URL to the video or audio for the anti-war message',
    demandOption: false,
  })
  .option('tlds', {
    type: 'string',
    describe: 'Comma-separated list of TLDs to target',
    demandOption: false,
  })
  .help()
  .argv;

// Locate the configuration file
const configFilePath = path.resolve(__dirname, 'sweetalert2-config.json');

// Read existing configuration
let config = {};
if (fs.existsSync(configFilePath)) {
  config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
}

// Update configuration with CLI inputs
const newConfig = { ...config };
if (argv.country) newConfig.country = argv.country;
if (argv.message) newConfig.message = argv.message;
if (argv.videoURL) newConfig.videoURL = argv.videoURL;
if (argv.tlds) newConfig.tlds = argv.tlds.split(',').map(tld => tld.trim());

// Write updated configuration back to file
fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2), 'utf-8');
console.log('SweetAlert2 configuration updated:', newConfig);
