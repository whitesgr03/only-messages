const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	content: { type: String, required: true },
	lastModified: { type: Date, required: true },
	createdAt: { type: Date, immutable: true },
	expiresAfter: { type: Date, immutable: true },
});

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
