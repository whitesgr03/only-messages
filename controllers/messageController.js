const asyncHandler = require("express-async-handler");
const fetch = require("node-fetch");
const { validationResult, checkSchema } = require("express-validator");

const authenticate = require("../utils/auth");
const Message = require("../models/message");

const index = asyncHandler(async (req, res, next) => {
	const getFakeMessages = async () => {
		const randomNumber = 2;
		const response = await fetch(
			`https://randomuser.me/api/?results=${randomNumber}&inc=email,name,picture`
		);
		const data = await response.json();

		const messages = [
			{
				user: {
					imageUrl: data.results[0].picture.medium,
					name: data.results[0].name.last,
				},
				time: "15:33",
				content:
					"This is the default message! If you join our members, you can watch all members' messages.",
			},
			{
				user: {
					imageUrl: data.results[1].picture.medium,
					name: data.results[1].name.last,
				},
				time: "14:30",
				content: "Create an account to enjoy Only Messages!",
			},
		];

		return messages;
	};

	const getMessages = async () => {
		const messages = await Message.find({})
			.populate("user")
			.sort({ createdAt: 1 })
			.exec();

		return messages;
	};

	const messages = req.isAuthenticated()
		? await getMessages()
		: await getFakeMessages();

	res.render("index", {
		messages,
	});
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
