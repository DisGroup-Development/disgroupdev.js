const FileSystem = require('node:fs');

FileSystem.writeFileSync(require('node:path').resolve(__dirname, '../docs/CNAME'), 'disgroupdev.js.org', { encoding: 'utf-8' });