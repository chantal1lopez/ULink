const express = require("express")
const authMiddleware = require("../middleware/session.js");
const { getChats, getMessages, sendMessage, findOrCreateChat } = require("../controllers/chat.js");
const router = express.Router()


router.post("/",authMiddleware, findOrCreateChat);

router.get("/",authMiddleware, getChats);

router.get("/messages/:id",authMiddleware, getMessages);

router.post("/message",authMiddleware, sendMessage);





module.exports = router