const express = require("express");

const router = express.Router();

const userControllers = require("../controllers/userController");
const messageControllers = require("../controllers/messageController");

router.get("/", messageControllers.index);

router("/message/create")
	.get(messageControllers.messageCreateGet)
	.post(messageControllers.messageCreatePost);
router("/message/update/:id")
	.get(messageControllers.messageUpdateGet)
	.post(messageControllers.messageUpdatePost);
router("/message/delete/:id")
	.get(messageControllers.messageDeleteGet)
	.post(messageControllers.messageDeletePost);

router("/user/register")
	.get(userControllers.userCreateGet)
	.post(userControllers.userCreatePost);
router("/user/sign-in")
	.get(userControllers.userAuthGet)
	.post(userControllers.userAuthPost);
router.get("/user/logout", userControllers.userLogoutGet);
module.exports = router;
