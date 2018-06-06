/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const semverCompare = require('semver-compare');
const pjson = require('../package.json');

const newVersion = process.argv[2];

if (!newVersion.match(/^\d+\.\d+\.\d+$/)) {
  throw new Error(`Invalid version number: ${newVersion} should be a semantic version number`);
}

const oldVersion = pjson.version;

if (semverCompare(oldVersion, newVersion) === 1) {
  throw new Error('Version numbers should go up');
}

['app/about.html', 'package.json', 'src/setup/components/App.jsx'].forEach((fileName) => {
  const fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' });
  fs.writeFileSync(fileName, fileContent.replace(oldVersion, newVersion));
});

