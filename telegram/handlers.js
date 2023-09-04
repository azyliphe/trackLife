import { Markup } from "telegraf";
import categoryController from "../database/controllers/category.controller.js";
import eventController from "../database/controllers/event.controller.js";
import userController from "../database/controllers/user.controller.js";
import i18n from "../utils/i18n.js";
import constants from "../utils/constants.js";
import userRole from "../utils/role.js"
import logger from "../utils/logger.js"

const handlers = {
	async handleAddCategories(ctx) {
		let parentCategory = ctx.match[3] ? ctx.match[1] : null;
		let category = ctx.match[3] ? ctx.match[3] : ctx.match[1];
		ctx.minutes = ctx.match[5] ? parseInt(ctx.match[5]) : ctx.match[5];
		//if exist subcategory needs to save parent first
		if (parentCategory) {
			if (category === parentCategory) {
				handleReplyI18n(ctx, "sameCategory");
				return;
			}
			//save category as father
			parentCategory = await categoryController.findOrCreate(parentCategory, ctx.user, null);
		}
		ctx.category = await categoryController.findOrCreate(category, ctx.user, parentCategory);
	},

	async handleAddEvents(ctx) {
		if (!ctx.category) {
			handleReplyI18n(ctx, "errorCategoryEmpty");
			return;
		}

		const currentDate = new Date();
		const nowTimestamp = currentDate.getTime();
		if (ctx.minutes) {
			currentDate.setMinutes(currentDate.getMinutes() - ctx.minutes);
			const startEvent = currentDate.getTime();
			await eventController.createEvent(ctx.user, ctx.category, startEvent, nowTimestamp);
		} else {
			await eventController.createEvent(ctx.user, ctx.category, nowTimestamp, null);
		}
		handleReplyI18n(ctx, "addEvent", ctx.category.name);
	},

	async handleUntilNow(ctx) {
		let lastEvent = await eventController.getLastEvent(ctx.user);

		if (!lastEvent.end) {
			lastEvent = await eventController.updateEndDateEvent(lastEvent, new Date());
			handleReplyI18n(ctx, "updateEndEvent", lastEvent.category.name);
		} else {
			handleReplyI18n(ctx, "alreadyEndEvent", lastEvent.category.name);
		}
	},

	async handleSeeLogs(ctx) {
		if (ctx.user.role !== userRole.ADMIN) {
			handleReplyI18n(ctx, "notAuthorized");
			return;
		}

		const lastLogFile = logger.getLastLogFile();
		if (lastLogFile) {
			handleReplyWithLog(ctx, process.env.LOG_FILE_PATH + "/" + lastLogFile);
		} else {
			handleReplyI18n(ctx, "logNotFound");
		}
	},

	async handleChangeLanguage(ctx, language) {
		ctx.user = await userController.updateLanguage(ctx.user, language);
		i18n.setLanguage(language);
		handleReplyI18n(ctx, "updateLanguage");
	},

	async handleListCategory(ctx) {
		let listCategory = await categoryController.getListCategoryFromUser(ctx.user);

		if (!listCategory || listCategory.length == 0) {
			handleReplyI18n(ctx, "listCategoryEmpty");
			return;
		}

		const mapCategory = listCategory.reduce((map, category) => {
			if (category.categoryParent) {
				map[category.categoryParent.name] = map[category.categoryParent.name] ?? [];
				map[category.categoryParent.name].push(category.name);
			} else {
				map[category.name] = map[category.name] ?? [];
			}
			return map;
		}, {});

		const indent = " ".repeat(constants.LIST_CATEGORY_INDENT_SIZE) + "|" + "_".repeat(constants.LIST_CATEGORY_INDENT_SIZE);
		let response = Object.entries(mapCategory).reduce((acc, [parent, children]) => {
			acc += parent + "\n";
			for (var i = 0; i < children.length; i++) {
				acc += indent + children[i] + "\n";
			}
			return acc;
		}, '');

		handleReply(ctx, response);
	},

	async handleDeleteLastEvent(ctx) {
		let lastEvent = await eventController.deleteLastEvent(ctx.user);

		if (lastEvent.deletedCount == 1) {
			handleReplyI18n(ctx, "deleteLastEvent");
		} else {
			handleReplyI18n(ctx, "errorDeleteLastEvent");
		}
	}
	
}

async function handleReply(ctx, message) {
	let keyboard = await getKeyboard(ctx);
	ctx.reply(message, Markup.keyboard(keyboard).resize());
}

async function handleReplyWithLog(ctx, file) {
	let keyboard = await getKeyboard(ctx);
	ctx.replyWithDocument({ source: file },
		Markup.keyboard(keyboard).resize()
	);
}

async function handleReplyI18n(ctx, message, ...parameters) {
	let keyboard = await getKeyboard(ctx);
	ctx.reply(i18n.__(message, ...parameters), Markup.keyboard(keyboard).resize());
}

async function getKeyboard(ctx) {
	let keyboard = [];

	let listCategory = await categoryController.getListCategoryFromUserLastMonthEventOrder(ctx.user);
	if (!listCategory) {
		return keyboard;
	}

	//listCategory = listCategory.filter(c => c.categoryParent == null);
	for (let i = 0; i < listCategory.length; i += constants.KEYBOARD_ELEMENTS) {
		keyboard.push(listCategory.slice(i, i + constants.KEYBOARD_ELEMENTS).map(item => item.name));
	}

	keyboard.push([
		constants.UNTIL_NOW_BTN,
		constants.LIST_CATEGORY_BTN,
		constants.DELETE_LAST_EVENT_BTN,
		...(ctx.user.role === userRole.ADMIN ? [constants.LOGS_BTN] : [])
	]);

	return keyboard;
}

export { handlers, handleReply, handleReplyI18n };