const express = require("express")
const authMiddleware = require("../middleware/session.js");
const { createArticle, deleteArticle, editArticle, filterArticles, getUserArticles, getArticleById, getOtherUserArticles, searchArticles } = require("../controllers/article.js");
const router = express.Router()



router.post("/",authMiddleware, createArticle);

router.delete("/:id",authMiddleware, deleteArticle);

router.patch("/:id",authMiddleware, editArticle);

router.get('/filter', authMiddleware, filterArticles);

router.get('/user-articles', authMiddleware, getUserArticles);

router.get('/:id', authMiddleware, getArticleById);

router.get('/user/:id', authMiddleware, getOtherUserArticles);

router.get('/search/:name', authMiddleware, searchArticles);




module.exports = router