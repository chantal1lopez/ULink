const express = require("express")
const authMiddleware = require("../middleware/session.js");
const { createNotification, updateNotification, getSentNotifications, getReceivedNotifications, addUserToProject  } = require("../controllers/notification.js");
const router = express.Router()


router.post("/",authMiddleware, createNotification);

router.patch("/:id",authMiddleware, updateNotification);

router.get('/sent', authMiddleware, getSentNotifications);

router.get('/received', authMiddleware, getReceivedNotifications);

router.post("/addUser",authMiddleware, addUserToProject);

module.exports = router