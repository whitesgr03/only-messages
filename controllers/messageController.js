const asyncHandler = require("express-async-handler");
const fetch = require("node-fetch");
const { validationResult, checkSchema } = require("express-validator");

const authenticate = require("../utils/auth");
const Message = require("../models/message");

const index = asyncHandler(async (req, res, next) => {
	const randomNumber = 5;
	const response = await fetch(
		`https://randomuser.me/api/?results=${randomNumber}&inc=email,name,picture`
	);
	const data = await response.json();

	res.render("index", { randomUser: data.results, user: req.user });
});

const messageCreateGet = [
	authenticate,
	asyncHandler(async (req, res, next) => {
		res.render("messageForm", { title: "Send a message" });
	}),
];
const messageCreatePost = [
	authenticate,
	asyncHandler(async (req, res, next) => {
		const validationSchema = {
			content: {
				trim: true,
				isLength: {
					options: {
						min: 1,
						max: 300,
					},
					errorMessage: "The content must be less than 300 long.",
				},
				escape: true,
			},
		};

		await checkSchema(validationSchema, ["body"]).run(req);

		const schemaErrors = validationResult(req);

		const message = {
			...req.body,
		};

		const handleAddMessage = async () => {
			const currentTime = new Date();

			const today = new Date(currentTime).setHours(0, 0, 0, 0);
			const tomorrow = new Date(currentTime).setDate(
				currentTime.getDate() + 1
			);

			const existsMessageOfTheDay = await Message.findOne({
				createdAt: {
					$gte: new Date(today),
					$lt: new Date(tomorrow),
				},
			}).exec();

			const newMessage = new Message({
				...message,
				user: req.user.id,
				lastModified: currentTime,
				createdAt: currentTime,
				isFirstMessageOfTheDay: !existsMessageOfTheDay,
			});

			await newMessage.save();
			res.redirect("/");
		};

		const handleRenderErrorMessage = () => {
			res.render("messageForm", {
				title: "Sign In",
				message,
				errors: schemaErrors.mapped(),
			});
		};

		schemaErrors.isEmpty()
			? handleAddMessage()
			: handleRenderErrorMessage();
	}),
];
const messageUpdateGet = async (req, res, next) => {};
const messageUpdatePost = async (req, res, next) => {};
const messageDeleteGet = async (req, res, next) => {};
const messageDeletePost = async (req, res, next) => {};

module.exports = {
	index,
	messageCreateGet,
	messageCreatePost,
	messageUpdateGet,
	messageUpdatePost,
	messageDeleteGet,
	messageDeletePost,
};
