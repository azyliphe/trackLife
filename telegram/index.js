import { Telegraf } from "telegraf";
import middleWare from "./middlewares.js";
import { handlers, handleReplyI18n } from "./handlers.js";
import constants from "../utils/constants.js"

const telegramBot = new Telegraf(process.env.TELEGRAM_TOKEN);

//enable our middleware
telegramBot.use(...middleWare);

telegramBot.start((ctx) => handleReplyI18n(ctx, "start"));
telegramBot.help((ctx) => handleReplyI18n(ctx, "help"));

telegramBot.command(constants.ENGLISH, (ctx) => handlers.handleChangeLanguage(ctx, constants.ENGLISH));
telegramBot.command(constants.ITALIAN, (ctx) => handlers.handleChangeLanguage(ctx, constants.ITALIAN));

//need to be in order, otherwise it will execute first /.*/ if is first
telegramBot.hears(constants.LIST_CATEGORY_BTN, (ctx) => handlers.handleListCategory(ctx));
telegramBot.hears(constants.UNTIL_NOW_BTN, (ctx) => handlers.handleUntilNow(ctx));
telegramBot.hears(constants.LOGS_BTN, (ctx) => handlers.handleSeeLogs(ctx));
telegramBot.hears(constants.DELETE_LAST_EVENT_BTN, (ctx) => handlers.handleDeleteLastEvent(ctx));

//here will save categories and events
telegramBot.hears(/.*/, async (ctx) => {
	const regex = /^([^0-9.]+)(\.([^0-9.]+))?(\s([\d]+))?$/u;
	
	ctx.match = ctx.message.text.match(regex);
	if (!ctx.match) {
		handleReplyI18n(ctx, "errorFormatNotValid")
		return;
	}
	await handlers.handleAddCategories(ctx);
	await handlers.handleAddEvents(ctx);
});


export default telegramBot;