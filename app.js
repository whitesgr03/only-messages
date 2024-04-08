const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const errorLog = require("debug")("ServerError");

const MongoStore = require("connect-mongo");
const session = require("express-session");

const passport = require("./config/passport");
const db = require("./config/database");

const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const clubRouter = require("./routes/club");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

process.env.NODE_ENV === "production" &&
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					imgSrc: ["'self'", "data:", "blob:"],
					styleSrc: [
						"'self'",
						"fonts.googleapis.com",
						"necolas.github.io",
					],
				},
			},
		})
	);
app.use(compression());

app.use(
	logger("dev", {
		skip: (req, res) => req.baseUrl !== "/club",
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
	session({
		secret: "onlyMessages",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			client: db.getClient(),
		}),
		cookie: {
			maxAge: 1000 * 60 * 60,
		},
	})
);
app.use(passport.session());

app.use((req, res, next) => {
	req.isAuthenticated()
		? (app.locals.loginUser = req.user)
		: (app.locals.loginUser = null);
	next();
});

app.use("/", indexRouter);
app.use("/club", clubRouter);

// Unknown routes handler
app.use((req, res, next) => {
	next(createError(404, "The page you are looking for cannot be found."));
});

// Errors handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);

	errorLog(`${err.name}: ${err.message}`);

	err.status ?? (err = createError(500, ""));

	err.name = err.name.replace(/([A-Z])/g, " $1").trim();

	res.render("error", {
		error: err,
	});
});

module.exports = app;
