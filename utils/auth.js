const createError = require("http-errors");

const authenticate = (req, res, next) => {
	req.isAuthenticated()
		? next()
		: next(
				createError(
					401,
					"Please sign in to your account to make authentication successful."
				)
		  );
};

module.exports = authenticate;
