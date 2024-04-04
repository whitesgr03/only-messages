const express = require("express");

const router = express.Router();

const userControllers = require("../controllers/userController");
const messageControllers = require("../controllers/messageController");

router.get("/", messageControllers.index);

router
	.route("/message/create")
	.get(messageControllers.messageCreateGet)
	.post(messageControllers.messageCreatePost);
router
	.route("/message/update/:id")
	.get(messageControllers.messageUpdateGet)
	.post(messageControllers.messageUpdatePost);
router
	.route("/message/delete/:id")
	.get(messageControllers.messageDeleteGet)
	.post(messageControllers.messageDeletePost);

router
	.route("/user/sign-up")
	.get(userControllers.userSignUpGet)
	.post(userControllers.userSignUpPost);
router
	.route("/user/sign-in")
	.get(userControllers.userAuthGet)
	.post(userControllers.userAuthPost);
router.get("/user/logout", userControllers.userLogoutGet);

module.exports = router;
