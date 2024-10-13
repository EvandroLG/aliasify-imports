#!/usr/bin/env node

/**
 * This script is a command-line tool for transforming import paths in JavaScript/TypeScript files
 * using jscodeshift. It allows specifying an alias for import paths and the source directory.
 */
const path = require('node:path');
const minimist = require('minimist');
const process = require('node:process');
const Runner = require('jscodeshift/src/Runner');

const transformPath = path.resolve(__dirname, '../index.cjs');

/**
 * Parsed command-line arguments.
 * @typedef {Object} Argv
 * @property {string} alias - The alias to use for import paths.
 * @property {string} srcDir - The source directory to base absolute imports on.
 * @property {string} parser - The parser to use.
 * @property {string} extensions - File extensions to transform.
 * @property {boolean} help - Flag to show help message.
 */
const argv = minimist(process.argv.slice(2), {
  alias: {
    h: 'help',
  },
  boolean: ['help'],
  string: ['alias', 'srcDir', 'parser', 'extensions'],
  default: {
    alias: '@',
    srcDir: 'src',
    parser: 'tsx',
    extensions: 'js,jsx,ts,tsx',
  },
});

if (argv.help) {
  console.log(`
Usage: aliasify-imports [options] <paths>

Options:
  --alias     The alias to use for import paths (default: "@")
  --srcDir    The source directory to base absolute imports on (default: "src")
  --parser    The parser to use (default: "tsx")
  --extensions  File extensions to transform (default: "js,jsx,ts,tsx")
  --help      Show this help message
`);
  process.exit(0);
}

const options = {
  runInBand: true,
  parser: argv.parser,
  extensions: argv.extensions,
  transform: transformPath,
  verbose: 0,
  transformOptions: {
    alias: argv.alias,
    srcDir: argv.srcDir,
  },
};

/**
 * Runs the transformation process using jscodeshift with the specified options.
 * Logs the result and exits the process with the appropriate status code.
 */
async function runTransformation() {
  try {
    await Runner.run(options.transform, [argv.srcDir], options);
    console.log('Transformation completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

runTransformation();
