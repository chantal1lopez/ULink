const { matchedData } = require("express-validator")
const { handleHttpError } = require("../utils/handleError")
const { articlesModel } = require("../models")


/**
 * Crea un nuevo articulo en la base de datos
 */
const createArticle = async (req, res) => {
    try {
        const articleData = req.body;

        articleData.author_id = req.user._id;
        articleData.author_name = req.user.name;

        const newArticle = await articlesModel.create(articleData);

        res.status(201).json(newArticle);
    } catch (err) {
        console.error("Error al crear el articulo:", err);
        res.status(500).json({ message: "Error al crear el articulo", error: err });
    }
};

/**
 * Elimina un articulo por su ID.
 */
const deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;

        const article = await articlesModel.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: "articulo no encontrado" });
        }

        if (article.author_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "No autorizado para eliminar este articulo" });
        }

        await articlesModel.findByIdAndDelete(articleId);

        res.json({ message: "Articulo eliminado con éxito" });
    } catch (err) {
        console.error("Error al eliminar el articulo:", err);
        res.status(500).json({ message: "Error al eliminar el articulo", error: err });
    }
};

/**
 * Edita (actualiza) un articulo por su ID.
 */
const editArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const updates = req.body;

        const article = await articlesModel.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: "articulo no encontrado" });
        }

        if (article.author_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "No autorizado para editar este articulo" });
        }

        const updatedProject = await articlesModel.findByIdAndUpdate(articleId, updates, { new: true });

        res.json(updatedProject);
    } catch (err) {
        console.error("Error al editar el articulo:", err);
        res.status(500).json({ message: "Error al editar el articulo", error: err });
    }
};

/**
 * Filtra artículos basándose en criterios específicos.
 */
const filterArticles = async (req, res) => {
    try {
        const { language, category } = req.query;
        let query = {};

        if (language) query.language = language;
        if (category) {
            const categoriesArray = category.split(',');
            query.categories = { $in: categoriesArray };
        }

        const articles = await articlesModel.find(query);

        res.json(articles);
    } catch (err) {
        console.error("Error al filtrar artículos:", err);
        res.status(500).json({ message: "Error al filtrar artículos", error: err });
    }
};

/**
 * Devuelve todos los articulos asociados a un usuario específico.
 */
const getUserArticles = async (req, res) => {
    try {
        const userId = req.user._id;

        const articles = await articlesModel.find({ author_id: userId });

        res.json(articles);
    } catch (err) {
        console.error("Error al obtener los proyectos del articulos:", err);
        res.status(500).json({ message: "Error al obtener los proyectos del articulos", error: err });
    }
};

/**
 * Devuelve la info de un articulo 
 */
const getArticleById = async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await articlesModel.findById(articleId);

        if (!article) {
            return res.status(404).json({ message: "Artículo no encontrado." });
        }

        res.json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el artículo." });
    }
};

/**
* Devuelve los articulos de un usuario en concreto
*/
const getOtherUserArticles = async (req, res) => {
    try {
        const authorId = req.params.userId;

        const articles = await articlesModel.find({ author_id: authorId });

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los artículos del usuario' });
    }
};

/**
 * Busqueda de articulos
 */
const searchArticles = async (req, res) => {
    try {
        const { name } = req.params;

        let searchQuery = {};

        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' };
        }

        const articles = await articlesModel.find(searchQuery);

        res.json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar artículos' });
    }
};


module.exports = { createArticle, deleteArticle, editArticle, filterArticles, getUserArticles, getArticleById, getOtherUserArticles, searchArticles }