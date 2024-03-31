const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
	lastModified: { type: Date, required },
	createdAt: { type: Date, immutable: true },
	expiresAfter: { type: Date, immutable: true },
});

module.exports = mongoose.Schema("Message", MessageSchema);
