import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date
	}
});

export default mongoose.model("Event", eventSchema);