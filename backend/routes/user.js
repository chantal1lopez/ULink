const express = require("express")
const { registerCtrl, loginCtrl, getProfile, editProfile, deleteUser, getFollowers, getFollowing, getUsersByFilter, getUserById, followUser, unfollowUser, saveArticle, getSavedArticles, unsaveArticle, saveProject, unsaveProject, getSavedProjects, searchUsers } = require("../controllers/user.js")
const {validatorRegister, validatorLogin} = require("../validators/auth")
const authMiddleware = require("../middleware/session.js")
const router = express.Router()


router.post("/register", validatorRegister, registerCtrl)

router.post("/login", validatorLogin, loginCtrl) 

router.get("/profile", authMiddleware, getProfile);

router.patch('/profile', authMiddleware, editProfile);

router.delete('/profile', authMiddleware, deleteUser);

router.get('/followers', authMiddleware, getFollowers);

router.get('/following', authMiddleware, getFollowing);

router.get('/filter', authMiddleware, getUsersByFilter);

router.get('/:id',authMiddleware, getUserById);

router.put('/follow/:id',authMiddleware, followUser);

router.put('/unfollow/:id',authMiddleware, unfollowUser);

router.put('/save/article/:id',authMiddleware, saveArticle);

router.get('/save/article',authMiddleware, getSavedArticles);

router.put('/unsave/article/:id',authMiddleware, unsaveArticle);

router.put('/save/project/:id',authMiddleware, saveProject);

router.get('/save/project',authMiddleware, getSavedProjects);

router.put('/unsave/project/:id',authMiddleware, unsaveProject);

router.get('/search/:name', authMiddleware, searchUsers);


module.exports = router