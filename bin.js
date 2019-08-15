#!/usr/bin/env node

const fs = require('fs');

const mri = require('mri');

const getHtmlTemplate = require('.');

const argv = process.argv.slice(2);

const { _: input, help, output } = mri(argv, {
  alias: {
    o: 'output',
    h: 'help'
  }
});

if (help || (!input.length && !output)) {
  console.log('Provide input files to create a game template with the symbols.');
  console.log('Optionally, provide --output [-o] to write template to a file instead of stdout.');

  return;
}

if (!input.length) {
  throw new Error('No input provided');
}

const template = getHtmlTemplate(input);

if (output) {
  fs.writeFileSync(output, template);
} else {
  console.log(template);
}
