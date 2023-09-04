import mongoose from "mongoose";
import userRole from "../../utils/role.js"

const userSchema = new mongoose.Schema({
	idTelegram: {
		type: Number,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	language: {
		type: String,
		default: 'en',
		required: true,
		maxlength: 2
	},
	role: {
		type: String,
		enum: [userRole.ADMIN, userRole.USER],
		default: userRole.USER,
	},
});

export default mongoose.model("User", userSchema);