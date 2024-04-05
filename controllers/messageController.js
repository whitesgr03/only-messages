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
