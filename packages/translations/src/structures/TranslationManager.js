const i18next = require('i18next');
const i18nextBackend = require('i18next-fs-backend');

const readDirectory = require('node:util').promisify(require('node:fs').readdir);
const statDirectory = require('node:util').promisify(require('node:fs').stat);

/**
 * @typedef {Object} TranslationManagerOptions
 * @property {String} defaultLanguage The default language to use if no language is specified.
 * @property {import('i18next').InitOptions} i18nextOptions Additional options to pass to i18next.
 * @property {String} locationTranslations The location of the translations
 */

class TranslationManager {

        /**
         * The constructor of the TranslationManager class.
         * @param {TranslationManagerOptions} options
         */
        constructor(options) {

                /**
                 * The namespaces of the translations.
                 * @type {?[]}
                 * @public
                 */
                this.namespaces = null;

                /**
                 * The map with all translations.
                 * @type {?Map<String, Function>}
                 * @public
                 */
                this.translations = null;

                /**
                 * The options of the TranslationManager.
                 * @type {TranslationManagerOptions}
                 * @public
                 */
                this.options = options;

                /**
                 * If the translations are loaded.
                 * @type {Boolean}
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

                await i18next.use(new i18nextBackend());

                await i18next.init({

                        backend: {

                                jsonIndent: 4,
                                loadPath: require('node:path').resolve(this.options.locationTranslations, './{{lng}}/{{ns}}.json')

                        },
                        fallbackLng: this.options.defaultLanguage,
                        preload: totalLanguages,
                        ns: namespaces,
                        ...this.options.i18nextOptions

                });

                this.namespaces = namespaces;
                this.translations = new Map(totalLanguages.map(language => [language, i18next.getFixedT(language)]));

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
                                        translationDir: require('node:path').resolve(options.translationDir, translationFile)

                                });

                                options.namespaces = translationFolder.namespaces;

                        } else options.namespaces.push(`${options.folderName}${translationFile.substring(0, translationFile.length - 5)}`);

                }

                return { namespaces: [...new Set(options.namespaces)], totalLanguages };

        }

        /**
         * Deletes a translation
         * @param {String} name The name of the translation
         * @returns {Boolean|null}
         * @public
         */
        delete(name) {

                if(!this.isReady || !this.get(name)) return null;

                this.translations.delete(name);

                return true;

        }

        /**
         * Gets a translation
         * @param {String} name The name of the translation
         * @returns {Function|null}
         * @public
         */
        get(name) {

                if(!this.isReady) return null;

                return this.translations.get(name) ?? null;

        }

        /**
         * Translates a string
         * @param {String} key The key
         * @param {Object} args The args
         * @param {Object} options The options
         * @returns {String|null}
         */
        translate(key, args, options = { language: this.options.defaultLanguage }) {

                return this.get(options.language)(key, args) ?? null;

        }
}

export default TranslationManager;