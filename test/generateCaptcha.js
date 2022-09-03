'use strict';

const FileSystem = require('node:fs');
const { Captcha } = require('../lib');

let cap = new Captcha();

cap.jpg.pipe(FileSystem.createWriteStream(require('node:path').resolve(__dirname, './captcha.jpg')));

console.log(cap.value);
