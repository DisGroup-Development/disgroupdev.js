const { Captcha } = require('../lib');
const FileSystem = require('node:fs');

let cap = new Captcha();

cap.jpg.pipe(FileSystem.createWriteStream(require('node:path').resolve(__dirname, './captcha.jpg')));

console.log(ca.value);