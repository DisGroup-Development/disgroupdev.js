const FileSystem = require('fs');

FileSystem.writeFileSync(require('path').resolve(__dirname, '../docs/CNAME'), 'disgroupdev.js.org', { encoding: 'utf-8' });