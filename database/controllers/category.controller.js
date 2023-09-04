import Category from "../models/category.model.js";
import logger from "../../utils/logger.js";

const categoryController = {

	async getListCategoryFromUser(user) {
		try {
			return await Category.find({ user }).populate("user").populate("categoryParent");
		} catch (error) {
			logger.error("Error find categories: " + error);
		}
	},

	async findOrCreate(name, user, categoryParent) {
		try {
			return await Category.findOneAndUpdate({ name, user }, { name, user, categoryParent }, { upsert: true, new: true })
				.populate("user")
				.populate("categoryParent");
		} catch (error) {
			logger.error("Error upsert category: " + error);
		}
	},

	async getListCategoryFromUserLastMonthEventOrder(user) {
		try {
			const lastMonth = new Date();
			//Subtract one month from the current date
			lastMonth.setMonth(lastMonth.getMonth() - 1);
			const listCategory = await Category.aggregate([
				{
					//condition
					$match: {
						user: user._id
					}
				},
				{
					//like a join with EVENT collection
					$lookup: {
						from: "events",
						localField: "_id",
						foreignField: "category",
						as: "event"
					}
				},
				{
					//calculate number of events created in the last month
					$addFields: {
						eventCountLastMonth: {
							$size: {
								$filter: {
									input: "$event",
									cond: { $gte: ["$$this.start", lastMonth] }
								}
							}
						}
					}
				},
				{
					//this is like the select, and with 0 u remove from the select the parameters
					$project: {
						event: 0,
						user: 0
					}
				},
				{
					//order by number of events in the last month
					$sort: { eventCountLastMonth: -1 }
				}

			]);
			return listCategory;
		} catch (error) {
			logger.error("Error find categories last month: " + error);
		}
	},

};

export default categoryController;