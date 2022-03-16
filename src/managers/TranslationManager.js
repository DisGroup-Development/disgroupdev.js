const FileSystem = require("node:fs");
const I18Next = require('i18next');
const I18NextFSBackend = require('i18next-fs-backend');
const Path = require('path');
const Util = require("node:util");

let isReady = false;

/**
 * @typedef {Object} TranslationManagerOptions
 * @property {String} locationTranslations The location of the translations
 * @property {I18Next.InitOptions} i18nextOptions The options for i18next
 */

/**
 * The translation manager for managing translations
 */
class TranslationManager {

    /**
     * The constructor for the TranslationManager
     * @param {TranslationManagerOptions} options
     */
    constructor(options) {

        /**
         * The array of all namespaces
         * @type {?[]}
         * @private
         */
        this._namespaces = null;

        /**
         * The collection of all translations
         * @type {?Map<String, Function>}
         * @private
         */
        this._translations = null;

        /**
         * The options of the translation manager
         * @type {TranslationManagerOptions}
         */
        this.options = options;

        /**
         * Reads a directory
         * @private
         */
        this.readDirectory = Util.promisify(FileSystem.readdir);

        /**
         * Stats a directory
         * @private
         */
        this.statDirectory = Util.promisify(FileSystem.stat);

        this._init().then(() => isReady = true);

    }

    /**
     * Inits 18next and the backend
     * @private
     */
    async _init() {

        const I18NextBackend = new I18NextFSBackend()
        const { namespaces, totalLanguages } = await this._loadAll("", this.options.locationTranslations, []);

        I18Next.use(I18NextBackend);

        await I18Next.init({

            backend: {
                jsonIndent: 4,
                loadPath: Path.resolve(this.options.locationTranslations, './{{lng}}/{{ns}}.json')
            },
            preload: totalLanguages,
            ns: namespaces,
            ...this.options.i18nextOptions

        });

        this._namespaces = namespaces;
        this._translations = new Map(totalLanguages.map(lng => [lng, I18Next.getFixedT(lng)]));

    }

    async _loadAll(folderName = '', translationDir, namespaces = []) {

        const translationDirectory = await this.readDirectory(translationDir);

        let totalLanguages = [];

        for(const translationFile of translationDirectory) {

            const translationStat = await this.statDirectory(Path.resolve(translationDir, translationFile));

            if(translationStat.isDirectory()) {

                const isTranslationFile = translationFile.includes('-');

                if(isTranslationFile) totalLanguages.push(translationFile);

                const translationFolder = await this._loadAll( isTranslationFile ? '' : `${translationFile}/`, Path.join(translationDir, translationFile), namespaces);

                namespaces = translationFolder.namespaces;

            } else {

                namespaces.push(`${folderName}${translationFile.substring(0, translationFile.length - 5)}`);

            }

        }

        return { namespaces: [...new Set(namespaces)], totalLanguages };

    }

    /**
     * Deletes a translation
     * @param {String} name The name of the translation
     * @returns {?Boolean}
     */
    delete(name) {

        if(!isReady) return null;

        const translation = this._translations.get(name);

        if(!translation) return null;

        this._translations.delete(name);

        return true;

    }

    /**
     * Gets a translation
     * @param {String} name The name of the translation
     * @returns {?Function}
     */
    get(name) {

        if(!isReady) return null;

        const translation = this._translations.get(name);

        return translation ?? null;

    }

    /**
     * Translate an string
     * @param {String} name The name of the translation
     * @param {String} key The key of the translation (Default category/file:KEY)
     * @param {?Object} args The arguments of the translation
     * @return {?String}
     */
    translate(name, key, args = {}) {

        const translation = this.get(name);

        return translation(key, args) ?? null;

    }

}

module.exports = TranslationManager;