import userController from "../database/controllers/user.controller.js";
import { handleReplyI18n } from "./handlers.js"
import i18n from "../utils/i18n.js";

async function skipEditMessage(ctx, next) {
	//await userController.createUser(ctx.message.from.id, ctx.message.from.username);
	if (!ctx.message) {
		handleReplyI18n(ctx, "errorEditMessage");
		return;
	}
	return next();
}

//dont want open to all. only check if is me.
async function checkAndSaveUser(ctx, next) {
	//await userController.createUser(ctx.message.from.id, ctx.message.from.username);
	ctx.user = await userController.getUserByTelegramId(ctx.message.from.id);
	if (!ctx.user) {
		handleReplyI18n(ctx, "errorNotAuthorized");
		return;
	}

	i18n.setLanguage(ctx.user.language);
	return next();
};

export default [skipEditMessage, checkAndSaveUser];