import User from "../models/user.model.js";
import logger from "../../utils/logger.js";

const userController = {
	async createUser(idTelegram, username) {
		try {
			return await User.create({ idTelegram, username });
		} catch (error) {
			logger.error("Error creating user: " + error);
		}
	},

	async getUserByTelegramId(idTelegram) {
		try {
			return await User.findOne({ idTelegram });
		} catch (error) {
			logger.error("Error getting user by idTelegram: " + error);
			//throw new Error("Error getting user by Telegram id");
		}
	},

	async updateLanguage(userId, language) {
		try {
			return await User.findByIdAndUpdate(userId, { $set: { language: language } }, { new: true });
		} catch (error) {
			logger.error("Error updating language: " + error);
		}
	},

};

export default userController;