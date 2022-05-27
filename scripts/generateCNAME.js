const FileSystem = require('node:fs');

FileSystem.writeFileSync(require('node:path').resolve(__dirname, '../docs/CNAME'), 'js.disgroupdev.de', { encoding: 'utf-8' });