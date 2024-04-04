const asyncHandler = require("express-async-handler");
const passport = require("../config/passport");
const bcrypt = require("bcrypt");
const { validationResult, checkSchema } = require("express-validator");

const User = require("../models/user");

const userSignUpGet = asyncHandler(async (req, res, next) => {
	res.render("userSignUp", { title: "Sign Up" });
});

module.exports = {
	userCreateGet,
	userCreatePost,
	userAuthGet,
	userAuthPost,
	userLogoutGet,
};
