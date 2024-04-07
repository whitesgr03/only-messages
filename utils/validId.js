const { isValidObjectId } = require("mongoose");
const createError = require("http-errors");

const validateId = (req, res, next) => {
	isValidObjectId(req.params.id)
		? next()
		: next(
				createError(
					404,
					"The message you are looking for cannot be found."
				)
		  );
};

module.exports = validateId;
