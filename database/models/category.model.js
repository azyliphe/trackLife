import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	categoryParent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category"
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
});

export default mongoose.model("Category", categorySchema);