const asyncHandler = require("express-async-handler");
const passport = require("../config/passport");
const bcrypt = require("bcrypt");
const { validationResult, checkSchema } = require("express-validator");

const User = require("../models/user");

const userSignInGet = asyncHandler(async (req, res, next) => {
	res.render("userSignIn", { title: "Sign In" });
});
const userSignInPost = asyncHandler(async (req, res, next) => {
	const validationSchema = {
		email: {
			trim: true,
			notEmpty: {
				errorMessage: "The email is required.",
			},
			escape: true,
		},
		password: {
			trim: true,
			notEmpty: {
				errorMessage: "The password is required.",
			},
			escape: true,
		},
	};

	await checkSchema(validationSchema, ["body"]).run(req);

	const schemaErrors = validationResult(req);

	const user = { ...req.body };

	const authenticate = passport.authenticate(
		"local",
		(err, userId, failInfo) => {
			err && next(err);
			failInfo &&
				res.render("userSignIn", {
					title: "Sign In",
					user,
					errors: { password: { msg: failInfo } },
				});
			userId && req.login(userId, () => res.redirect("/"));
		}
	);

	const handleRenderErrorsMessage = () => {
		res.render("userSignIn", {
			title: "Sign In",
			user,
			errors: schemaErrors.mapped(),
		});
	};

	schemaErrors.isEmpty()
		? authenticate(req, res, next)
		: handleRenderErrorsMessage();
});
const userSignUpGet = asyncHandler(async (req, res, next) => {
	res.render("userSignUp", { title: "Sign Up" });
});
const userSignUpPost = [
	asyncHandler(async (req, res, next) => {
		const validationSchema = {
			name: {
				trim: true,
				isLength: {
					options: { min: 1, max: 30 },
					errorMessage: "The name length must be 1 to 30.",
					bail: true,
				},
				custom: {
					options: value => value.match(/^[a-zA-Z]\w*$/),
					errorMessage:
						"The name must be alphanumeric and underscore.",
					bail: true,
				},
				escape: true,
				custom: {
					options: value =>
						new Promise(async (resolve, reject) => {
							const existingUsername = await User.findOne({
								name: value,
							}).exec();
							existingUsername ? reject() : resolve();
						}),
					errorMessage: "The name is been used.",
				},
			},
			email: {
				trim: true,
				isEmail: {
					errorMessage: "The email must be in the correct format..",
					bail: true,
				},
				normalizeEmail: {
					errorMessage: "The email must be in standard format.",
					bail: true,
				},
				escape: true,
				custom: {
					options: value =>
						new Promise(async (resolve, reject) => {
							const existingUserEmail = await User.findOne({
								email: value,
							}).exec();
							existingUserEmail ? reject() : resolve();
						}),
					errorMessage: "The email is been used.",
				},
			},
			password: {
				trim: true,
				isStrongPassword: {
					errorMessage:
						"The password must contain one or more numbers, special symbols, lowercase and uppercase characters, and at least 8 characters without spaces.",
				},
				escape: true,
			},
			confirmPassword: {
				trim: true,
				escape: true,
				custom: {
					options: (value, { req }) => value === req.body.password,
					errorMessage:
						"The confirmation password is not the same as the password.",
				},
			},
		};

		await checkSchema(validationSchema, ["body"]).run(req);

		const schemaErrors = validationResult(req);

		const user = {
			...req.body,
		};

		const handleSignUp = () => {
			const currentTime = new Date();
			const randomSalt = 10;

			bcrypt.hash(
				user.password,
				randomSalt,
				async (err, hashedPassword) => {
					const handleAddUser = async () => {
						const newUser = new User({
							...user,
							password: hashedPassword,
							lastModified: currentTime,
							createdAt: currentTime,
							isAdmin: true,
						});

						await newUser.save();

						next();
					};

					err ? next(err) : handleAddUser();
				}
			);
		};

		const handleRenderErrorsMessage = () => {
			res.render("userSignUp", {
				title: "Sign Up",
				user,
				errors: schemaErrors.mapped(),
			});
		};

		schemaErrors.isEmpty() ? handleSignUp() : handleRenderErrorsMessage();
	}),
	userSignInPost,
];
const userLogoutGet = asyncHandler(async (req, res, next) => {
	req.user &&
		req.logout(err => {
			err ? next(err) : res.redirect("/");
		});
});

module.exports = {
	userSignUpGet,
	userSignUpPost,
	userSignInGet,
	userSignInPost,
	userLogoutGet,
};
