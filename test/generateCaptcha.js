'use strict';

const FileSystem = require('node:fs');
const { Captcha } = require('../lib');

let cap = new Captcha();

cap.jpeg.pipe(FileSystem.createWriteStream(require('node:path').resolve(__dirname, './captcha.jpg')));

console.log(cap.value);
