const express = require("express")
const authMiddleware = require("../middleware/session.js")
const { createProject, getUserProjects, deleteProject, editProject, filterProjects, getOtherUserProjects, searchProjects } = require("../controllers/project.js")
const router = express.Router()



router.post("/",authMiddleware, createProject);

router.get('/user-project', authMiddleware, getUserProjects);

router.delete("/:id",authMiddleware, deleteProject);

router.patch("/:id",authMiddleware, editProject);

router.get('/filter', authMiddleware, filterProjects);

router.get('/user/:id', authMiddleware, getOtherUserProjects);

router.get('/search/:name', authMiddleware, searchProjects);



module.exports = router