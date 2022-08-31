const Canvas = require('canvas');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

/**
 * @typedef {Object} CaptchaOptions
 * @property {?Number} height The height of the captcha (default: 250)
 * @property {?Number} length The length of the captcha (default: 6)
 * @property {?String} value The value of the captcha if not provided it will be generated randomly
 * @property {?Number} width The width of the captcha (default: 400) ⚠️ Do only change if you know what you do! ⚠️
 */

/**
 * The captcha class
 * @class
 */
class Captcha {

    /**
     * The constructor of the captcha class
     * @param {CaptchaOptions} options 
     */
    constructor(options = {}) {

        if(!options.height || typeof options.height !== 'number') options.height = 250;
        if(!options.length || typeof options.length !== 'number') options.length = 6;
        if(!options.width || typeof options.width !== 'number') options.width = 400;

        /**
         * The canvas
         * @type {Canvas.Canvas}
         * @private
         */
        this._canvas = Canvas.createCanvas(options.width, options.height);

        /**
         * The options of the captcha
         * @type {CaptchaOptions}
         * @public
         */
        this.options = options;

        /**
         * The value of the captcha
         * @type {String}
         * @public
         */
        this.value = options.value ?? Captcha.randomText(options.length);

        this._generateCaptcha();

    }

    /**
     * Generates the captcha
     * @private
     */
    _generateCaptcha() {

        const ctx = this._canvas.getContext('2d');

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';

        ctx.beginPath();
        ctx.fillRect(0, 0, this.options.width, this.options.height);
        ctx.save();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;

        ctx.beginPath();

        const coords = [];

        for(let i = 0; i < 4; i++) {

            if(!coords[i]) coords[i] = [];

            for(let j = 0; j < 5; j++) coords[i][j] = Math.round(Math.random() * 80) + j * 80;

            if(!(i % 2)) coords[i] = Captcha.shuffleArray(coords[i]);

        }

        for(let i = 0; i < coords.length; i++) {

			if (!(i % 2)) {

				for(let j = 0; j < coords[i].length; j++) {

					if (!i) {

						ctx.moveTo(coords[i][j], 0);
						ctx.lineTo(coords[i + 1][j], this.options.width);

					} else {

						ctx.moveTo(0, coords[i][j]);
						ctx.lineTo(this.options.width, coords[i + 1][j]);

					}
				}

			}

		}

        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.lineWidth = 0;

        for(let i = 0; i < 200; i++) {

			ctx.beginPath();
            ctx.arc(Math.round(Math.random() * 360) + 20, Math.round(Math.random() * 360) + 20, Math.round(Math.random() * 7) + 1, 0, Math.PI * 2);
			ctx.fill();

		}

        ctx.font = "bold 75px sans-serif";
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        ctx.translate(0, this.options.height);
        ctx.translate(
			Math.round(Math.random() * 100 - 50) + 200,
			-1 * Math.round(Math.random() * (this.options.height / 4) - this.options.height / 8) - this.options.height / 2
		);ctx.rotate(Math.random() - 0.5);
        ctx.beginPath();
        ctx.fillText(this.value, 0, 0);
        ctx.restore();

        for(let i = 0; i < 5000; i++) {

			ctx.beginPath();

			let color = "#";

			while (color.length < 7) color += Math.round(Math.random() * 16).toString(16);

			color += "a0";

			ctx.fillStyle = color;
			ctx.arc(Math.round(Math.random() * this.options.width),	Math.round(Math.random() * this.options.height), Math.random() * 2, 0, Math.PI * 2);
			ctx.fill();

		}

    }

    /**
     * The JPG stream of the captcha
     * @returns {Canvas.JPEGStream}
     * @public
     */
    get jpeg() {

        return this._canvas.createJPEGStream();

    }

    /**
     * The PDF stream of the captcha
     * @returns {Canvas.PDFStream}
     * @public
     */
    get pdf() {

        return this._canvas.createPDFStream();

    }

    /**
     * The PNG stream of the captcha
     * @returns {Canvas.PNGStream}
     * @public
     */
    get png() {

        return this._canvas.createPNGStream();

    }

    /**
     * Generates a random text
     * @param {Number} length 
     * @returns {String}
     * @public
     */
    static randomText(length = 6) {

        if(typeof length !== 'number') throw new DisGroupDevError(Messages.NOT_A_NUMBER(length));

        return Math.random().toString(36).replace(/[^a-z]|[gkqr]+/gi, "").substring(0, length).toUpperCase();

    }

    /**
     * Shuffles an array with numbers
     * @param {Array<Number>} arr 
     * @returns {Array<Number>}
     * @public
     */
    static shuffleArray(arr) {

        let i = arr.length;
        let temp;
        let rndIndex;

        while(0 !== i) {

            rndIndex = Math.floor(Math.random() * i);
            i--;

            temp = arr[i];
            arr[i] = arr[rndIndex];
            arr[rndIndex] = temp;

        }

        return arr;

    }

}

module.exports = Captcha;