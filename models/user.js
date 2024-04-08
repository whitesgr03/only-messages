const mongoose = require("mongoose");

// https://www.mermaidchart.com/app/projects/e0f536bb-998e-4d24-b289-cccdeffc826d/diagrams/163dc625-9a3a-4993-8ce5-b88257eb5795/version/v0.1/edit

const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		password: { type: String, required: true },
		lastModified: { type: Date, required: true },
		email: {
			type: String,
			required: true,
			immutable: true,
			lowercase: true,
		},
		createdAt: { type: Date, required: true, immutable: true },
		isAdmin: { type: Boolean, immutable: true },
		expiresAfter: { type: Date, immutable: true },
	},
	{
		virtuals: {
			nameFirstLetter: {
				get() {
					return this.name.charAt(0).toUpperCase();
				},
			},
		},
	}
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
