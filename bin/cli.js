#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var save = require('../lib/save');
var open = require('../lib/open');
var tool = require('..');

var REQUIRED = new Date() + '-required';

var args = {
  input: REQUIRED,
  output: REQUIRED,
  json: null,
  maxTris: null,
  log: null,
  score: null,
  outlier: null
};

for (var i=2; i<process.argv.length; i+=2) {
  var key = process.argv[i].substr(2);
  var val = process.argv[i+1];
  if (args[key] === undefined) exit('Unknown flag: '+key);
  var vk = (val || '--input').substr(2);
  if (args[vk] !== undefined) exit('Missing value for '+key);
  if (args[key] !== null && args[key] !== REQUIRED) exit('Value already set for '+key);
  args[key] = val;
}

Object.keys(args).forEach(key => {
  if (args[key] === REQUIRED) exit('Missing required arg: '+key);
});

if (args.maxTris) args.maxTris = parseInt(args.maxTris);
if (args.log) args.log = parseInt(args.log);
args.json = args.json !== 'false';

var hooks = ['score', 'outlier'].reduce((m, k) => {
  if (args[k]) {
    try {
      var file = path.resolve(process.cwd(), args[k]);
      m[k] = require(file);
    }
    catch (err) {
      exit('Error loading hook '+k+': '+err.message);
    }
  }
  return m;
}, {});

runner().catch(err => { exit(err.stack); });

async function runner() {
  var img = await open(args.input);
  var out = tool(img, {
    maxTris: args.maxTris,
    hooks,
    returnJSON: args.json,
    log: args.log
  });
  if (args.json) return fs.writeFileSync(args.output, JSON.stringify(out, null, 2));
  await save(out, args.output);
}

function exit(msg) {
  console.error(msg);
  process.exit(1);
}
