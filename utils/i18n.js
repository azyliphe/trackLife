import i18n from "i18n";
import path from "path";
import constants from "../utils/constants.js"

i18n.configure({
	locales: [constants.ENGLISH, constants.ITALIAN],
	defaultLocale: constants.ENGLISH,
	directory: path.join("./", "locales"),
});

i18n.setLanguage = function(language) {
	i18n.setLocale(language);
}

export default i18n;