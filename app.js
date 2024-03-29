const express = require("express");
const path = require("path");

const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const clubRouter = require("./routes/club");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/club", clubRouter);


module.exports = app;
