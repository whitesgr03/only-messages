const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const errorLog = require("debug")("AuthenticateError");

const User = require("../models/user");

passport.use(
	new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });
				const match =
					user && (await bcrypt.compare(password, user.password));

				match
					? done(null, user.id)
					: done(null, false, "Wrong password please try again.");
			} catch (err) {
				done(err);
			}
		}
	)
);

passport.serializeUser((id, done) => {
	done(null, id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id).catch(err => {
		errorLog(`deserializeUser ${err.name}: ${err.message}`);
		done(null, false);
	});
	done(null, user);
});

module.exports = passport;
