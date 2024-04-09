const createError = require("http-errors");
const { isValidObjectId } = require("mongoose");
const Message = require("../models/message");

const permission = async (req, res, next) => {
	const { id, isAdmin } = req.user;

	const message =
		isValidObjectId(req.params.id) &&
		(await Message.findById(req.params.id).populate("user").exec());

	message && (isAdmin || message.user.id === id)
		? next()
		: next(
				createError(
					404,
					"The page you are looking for cannot be found."
				)
		  );
};

module.exports = permission;
