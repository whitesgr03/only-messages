const asyncHandler = require("express-async-handler");
const { validationResult, checkSchema } = require("express-validator");

const authenticate = require("../utils/auth");
const permission = require("../utils/permission");
const Message = require("../models/message");

const index = asyncHandler(async (req, res, next) => {
	const getFakeMessages = () => {
		const name = "Anonymous";
		const messages = [
			{
				user: {
					name,
				},
				isFirstMessageOfTheDay: true,
				content:
					"This is the default message! If you join our members, you can watch all members' messages.",
			},
			{
				user: {
					name,
				},
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
		: getFakeMessages();

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

			const countUserMessages = await Message.countDocuments({
				user: req.user.id,
			}).exec();

			const oneDay = 24 * 60 * 60 * 1000;

			process.env.NODE_ENV === "production" &&
				countUserMessages > 10 &&
				(newUser.expiresAfter = new Date(Date.now() + oneDay));

			await newMessage.save();
			res.redirect("/");
		};

		const handleRenderErrorMessage = () => {
			res.render("messageForm", {
				title: "Send a message",
				message,
				errors: schemaErrors.mapped(),
			});
		};

		schemaErrors.isEmpty()
			? handleAddMessage()
			: handleRenderErrorMessage();
	}),
];
const messageUpdateGet = [
	authenticate,
	permission,
	asyncHandler(async (req, res, next) => {
		const message = await Message.findById(req.params.id, {
			content: 1,
		}).exec();

		res.render("messageForm", {
			title: "Edit message",
			message,
		});
	}),
];
const messageUpdatePost = [
	authenticate,
	permission,
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
			id: req.params.id,
			...req.body,
		};

		const handleUpdateMessage = async () => {
			const currentTime = new Date();
			message.user = req.user.id;
			message.lastModified = currentTime;

			await Message.findByIdAndUpdate(req.params.id, message).exec();

			res.redirect("/");
		};

		const handleRenderErrorMessage = () => {
			res.render("messageForm", {
				title: "Edit message",
				message,
				errors: schemaErrors.mapped(),
			});
		};

		schemaErrors.isEmpty()
			? handleUpdateMessage()
			: handleRenderErrorMessage();
	}),
];
const messageDeleteGet = [
	authenticate,
	permission,
	asyncHandler(async (req, res, next) => {
		const messages = await Message.find({})
			.populate("user")
			.sort({ createdAt: 1 })
			.exec();

		res.render("index", {
			messages,
			removeId: req.params.id,
		});
	}),
];
const messageDeletePost = [
	authenticate,
	permission,
	asyncHandler(async (req, res, next) => {
		await Message.findByIdAndDelete(req.params.id).exec();
		res.redirect("/");
	}),
];

module.exports = {
	index,
	messageCreateGet,
	messageCreatePost,
	messageUpdateGet,
	messageUpdatePost,
	messageDeleteGet,
	messageDeletePost,
};
