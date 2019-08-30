#!/usr/bin/env node

const fs = require('fs');

const path = require('path');

const mri = require('mri');

const puppeteer = require('puppeteer');

const getHtmlTemplate = require('.');

const argv = process.argv.slice(2);

const { _: input, help, output, rules: rulesPath, html: printHtml } = mri(argv, {
  boolean: ['html'],
  alias: {
    r: 'rules',
    o: 'output',
    h: 'help'
  }
});

if (help || (!input.length && !output)) {
  console.log('Provide input files to create a game template with the symbols.');
  console.log('Pass --rules [-r] path to print a rules card, too.');
  console.log('Optionally, provide --output [-o] to write template to a file instead of stdout.');
  console.log('Pass --html if you want to get the raw html template instead of PDF file.')

  return;
}

if (!input.length) {
  throw new Error('No input provided.');
}

if (input.length < 57) {
  throw new Error(`Required 57 symbols, provided only ${input.length}.`);
}

let rules;

if (rulesPath) {
  rules = fs.readFileSync(rulesPath);
}

const html = getHtmlTemplate(input, rules);

if (printHtml) {
  return writeOutput(html, output);
}

getPdf(html).then(pdf => {
  writeOutput(pdf, output);
})

async function getPdf(html) {
  fs.writeFileSync('./.tmp.html', html);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('file://' + path.resolve(__dirname, './.tmp.html'));

  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();

  fs.unlinkSync('./.tmp.html')

  return pdf;
}

function writeOutput(content, output) {
  if (output) {
    fs.writeFileSync(output, content);
  } else {
    process.stdout.write(content);
  }
}
