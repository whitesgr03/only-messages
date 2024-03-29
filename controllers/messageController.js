const asyncHandler = require("express-async-handler");

const index = asyncHandler(async (req, res, next) => {
	res.render("index");
});

module.exports = {
	index,
};
