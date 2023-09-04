import Event from "../models/event.model.js";
import logger from "../../utils/logger.js";

const eventController = {
	async createEvent(userId, categoryId, start, end) {
		try {
			return await Event.create({ user: userId, category: categoryId, start, end });
		} catch (error) {
			logger.error("Error creating event: " + error);
		}
	},

	async getLastEvent(userId) {
		try {
			return await Event.findOne({ user: userId }).sort({ start: 'desc' }).populate("user").populate("category");
		} catch (error) {
			logger.error("Error retrieving last event: " + error);
		}
	},

	async deleteLastEvent(userId) {
		try {
			return await Event.deleteOne({ user: userId }).sort({ start: 'desc' }).populate("user").populate("category");
		} catch (error) {
			logger.error("Error retrieving last event: " + error);
		}
	},

	async updateEndDateEvent(eventId, endDate) {
		try {
			return await Event.findByIdAndUpdate(eventId, { $set: { end: endDate } }, { new: true }).populate("user").populate("category");
		} catch (error) {
			logger.error("Error updating event: " + error);
		}
	},

};

export default eventController;