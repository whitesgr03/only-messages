const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");

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
					imgSrc: [
						// "storage.googleapis.com",
						// "ik.imagekit.io",
						"data:",
						"blob:",
					],
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
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/club", clubRouter);

// unknown routes handler
app.use((req, res, next) => {
	next(createError(404, "Page not found", { type: "page" }));
});


module.exports = app;
