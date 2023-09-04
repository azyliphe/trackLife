import telegramBot from "./telegram/index.js";
import db from "./database/index.js";
import logger from "./utils/logger.js";

db.once("open", () => {
	logger.info("Connessione al database effettuata con successo");
});

//start telegramBot
telegramBot.launch()
	.then(() => logger.info("Telegram started."))
	.catch((err) => logger.error("Ooops, encountered an error for ", err));
//Error Handler, for now only console.
telegramBot.catch((err) => logger.error("Ooops, encountered an error for ", err));