const FileSystem = require('node:fs');

console.log('Generating CNAME...')

FileSystem.writeFileSync(require('node:path').resolve(__dirname, '../docs/CNAME'), 'disgroupdev.js.org', { encoding: 'utf-8' });

console.log('Generated CNAME!')