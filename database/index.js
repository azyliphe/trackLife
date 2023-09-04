import mongoose from "mongoose";
import logger from "../utils/logger.js";

//necessary to create the models
import userModel from "./models/user.model.js";
import categoryModel from "./models/category.model.js";
import eventModel from "./models/event.model.js";
//^necessary to create the models

//database connection
mongoose.connect("mongodb://" + process.env.DATABASE_USER + ":" + process.env.DATABASE_PASS + "@" + process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", (error) => logger.error("Errore nella connessione al database.", error));

//export connection
export default db;