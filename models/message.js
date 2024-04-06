const mongoose = require("mongoose");
const { isThisYear, format } = require("date-fns");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		isFirstMessageOfTheDay: { type: Boolean, immutable: true },
		lastModified: { type: Date, required: true },
		createdAt: { type: Date, immutable: true },
		expiresAfter: { type: Date, immutable: true },
	},
	{
		virtuals: {
			date: {
				get() {
					return isThisYear(this.createdAt)
						? format(new Date(this.createdAt), "E, MMMM d")
						: format(new Date(this.createdAt), "E, MMMM d, y");
				},
			},
			time: {
				get() {
					return format(new Date(this.createdAt), "HH:mm");
				},
			},
		},
	}
);

const MessageModel = mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
