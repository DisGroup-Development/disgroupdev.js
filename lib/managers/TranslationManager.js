const i18next = require('i18next');
const i18nextBackend = require('i18next-fs-backend');

const { DisGroupDevError, Messages } = require('../errors/DisGroupDevError');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);

/**
 * @typedef {Object} TranslationManagerOptions
 * @property {String} defaultLanguage The default language to use if no language is specified.
 * @property {import('i18next').InitOptions} i18nextOptions Additional options to pass to i18next.
 * @property {String} locationTranslations The location of the translations
 */

/**
 * The translation manager.
 * @class
 */
class TranslationManager {

        /**
         * The constructor of the TranslationManager class.
         * @param {TranslationManagerOptions} options
         */
        constructor(options) {

                if(!options.locationTranslations || typeof options.locationTranslations !== 'string') throw new DisGroupDevError(Messages.INVALID_LOCATION);

                /**
                 * The namespaces of the translations.
                 * @type {?[]}
                 * @private
                 */
                this._namespaces = null;

                /**
                 * The map with all translations.
                 * @type {?Map<String, Function>}
                 * @private
                 */
                this._translations = null;

                /**
                 * The options of the TranslationManager.
                 * @type {TranslationManagerOptions}
                 * @public
                 */
                this.options = options;

                /**
                 * If the translations are loaded.
                 * @type {Boolean}
                 * @public
                 */
                this.isReady = false;

                this._init().then(() => this.isReady = true);

        }

        /**
         * Inits the TranslationManager.
         * @returns {Promise<void>}
         * @private
         */
        async _init() {

                const { namespaces, totalLanguages } = await this._loadAll();

                i18next.use(new i18nextBackend());

                await i18next.init({

                        backend: {

                                jsonIndent: 4,
                                loadPath: require('node:path').resolve(this.options.locationTranslations, './{{lng}}/{{ns}}.json')

                        },
                        fallbackLng: this.options.defaultLanguage ?? 'en-US',
                        initImmediate: false,
                        interpolation: { escapeValue: false },
                        load: 'all',
                        ns: namespaces,
                        preload: totalLanguages,
                        ...this.options.i18nextOptions

                });

                this._namespaces = namespaces;
                this._translations = new Map(totalLanguages.map(language => [language, i18next.getFixedT(language)]));

        }

        /**
         * @typedef {Object} LoadAllOptions
         * @property {String} [folderName] The name of the folder
         * @property {String} [translationDir] The location of the translations
         * @property {Array} [namespaces] The namespaces
         */

        /**
         * Loads all translations
         * @param {LoadAllOptions} options The options for loading all translations
         * @returns {Promise<Object<Array<Set>, Array>>}
         * @private
         */
        async _loadAll(options = { folderName: '', namespaces: [], translationDir: this.options.locationTranslations }) {

                const translationDirectory = await readDirectory(options.translationDir);

                let totalLanguages = [];

                for(const translationFile of translationDirectory) {

                        const translationStat = await statDirectory(require('node:path').resolve(options.translationDir, translationFile));

                        if(translationStat.isDirectory()) {

                                const isLanguage = translationFile.includes('-');

                                if(isLanguage) totalLanguages.push(translationFile);

                                const translationFolder = await this._loadAll({

                                        folderName: isLanguage ? '' : `${translationFile}/`,
                                        namespaces: options.namespaces,
                                        translationDir: require('node:path').join(options.translationDir, translationFile)

                                });

                                options.namespaces = translationFolder.namespaces;

                        } else options.namespaces.push(`${options.folderName}${translationFile.substring(0, translationFile.length - 5)}`);

                }

                return { namespaces: [...new Set(options.namespaces)], totalLanguages };

        }

        /**
         * Deletes a translation
         * @param {String} name The name of the translation
         * @returns {Map<String, Function>|null}
         * @public
         */
        delete(name) {

                if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));

                if(!this._translations.has(name)) return null;

                this._translations.delete(name);

                return this._translations;

        }

        /**
         * Gets a translation
         * @param {String} name The name of the translation
         * @returns {Function|null}
         * @public
         */
        get(name) {

                if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));

                return this._translations.get(name) ?? null;

        }

        /**
         * Checks if a translation exists
         * @param {String} name The name of the translation
         * @returns {Boolean}
         * @public
         */
        has(name) {

                if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));

                return this._translations.has(name);

        }

        /**
         * Lists all translations
         * @returns {Function[]|null}
         * @public
         */
        list() {

                return [...this._translations.values()];

        }

        /**
         * Sets a translation
         * @param {String} name The name of the translation
         * @param {Function} value The function of the translation (<i18next>.getFixedT)
         * @returns {?Map<String, Function>}
         * @public
         */
        set(name, value) {

                if(typeof name !== 'string') throw new DisGroupDevError(Messages.NOT_A_STRING(name));
                if(typeof value !== 'function') throw new DisGroupDevError(Messages.NOT_A_FUNCTION(value));

                return this._translations.set(name, value);

        }

        /**
         * Gets the number of translations
         * @returns {Number}
         * @public
         */
        size() {

                return this._translations.size;

        }

        /**
         * @typedef {Object} TranslateOptions
         * @property {String} [language] The language
         */

        /**
         * Translates a string
         * @param {String} key The key
         * @param {Object} [args={}] The args
         * @param {TranslateOptions} options The options
         * @returns {String|null}
         * @public
         */
        translate(key, args = {}, options = { language: this.options.defaultLanguage }) {

                if(!this.isReady) throw new DisGroupDevError(Messages.NOT_READY);

                return this.get(options.language)(key, args) ?? null;

        }
}

module.exports = TranslationManager;