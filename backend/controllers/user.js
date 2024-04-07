const { matchedData } = require("express-validator")
const { tokenSign } = require("../utils/handleJwt")
const { encrypt, compare } = require("../utils/handlePassword")
const { handleHttpError } = require("../utils/handleError")
const { usersModel, projectsModel, notificationsModel } = require("../models")

/**
 * Rregistra un nuevo usuario
 */
const registerCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const password = await encrypt(req.password)
        const body = { ...req, password }
        const profileDefaults = {
            location: { country: '', city: '' },
            image: '',
            description: '',
            following: [],
            followers: [],
            config: {},
            projects: [],
            articles: [],
            profile: {
                contact: {
                    email: '',
                    linkedin: '',
                    web: '',
                    twitter: '',
                    instagram: ''
                },
                habilities: [],
                projects: [],
                interest: [],
                languages: []
            },
            saved_projects: [],
            saved_articles: []
        };

        const dataUser = await usersModel.create({ ...body, password, ...profileDefaults });

        dataUser.set('password', undefined, { strict: false })

        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        }
        res.send(data)
    } catch (err) {
        if (err.code === 11000) {
            return handleHttpError(res, "El email ya existe", 409);
        } else {
            console.log(err);
            handleHttpError(res, "Error al registrar al usuario", 500);
        }
    }
}


/**
 * Login del usuario
 */
const loginCtrl = async (req, res) => {
    try {
        req = matchedData(req)
        const user = await usersModel.findOne({ email: req.email }).select("+password");

        if (!user) {
            handleHttpError(res, "El usuario no existe", 404)
            return
        }

        const hashPassword = user.password;
        const check = await compare(req.password, hashPassword)

        if (!check) {
            handleHttpError(res, "Contraseña incorrecta", 401)
            return
        }

        user.set('password', undefined, { strict: false })
        const data = {
            token: await tokenSign(user),
            user: user
        }

        res.send(data)

    } catch (err) {
        console.log(err)
        handleHttpError(res, "Error al iniciar sesión")
    }
}

/**
 *  Devuelve el perfil del usuario
 */
const getProfile = async (req, res) => {
    try {
        const { _id } = req.user._id;
        const user = await usersModel.findById(_id);

        if (!user) {
            handleHttpError(res, "El usuario no existe", 404)
            return
        }

        res.send(user);

    } catch (err) {
        console.log(err)
        handleHttpError(res, "Error al acceder a la información del usuario", 401)
    }
}

/**
 *  Edita el perfil del usuario
 */
const editProfile = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const data = req.body;

        if (data.password) {
            data.password = await encrypt(data.password);
        }

        const updatedUser = await usersModel.findByIdAndUpdate(userId, data, { new: true }).select('-password');

        if (!updatedUser) {
            handleHttpError(res, "Usuario no encontrado", 404);
            return;
        }

        res.send(updatedUser);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "Error al actualizar el perfil del usuario", 401);
    }
};

/**
 * Elimina el usuario
 */
const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await usersModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            handleHttpError(res, "Usuario no encontrado", 404);
            return;
        }

        res.send({ message: "Usuario eliminado con éxito" });
    } catch (err) {
        console.log(err);
        handleHttpError(res, "Error al eliminar al usuario", 500);
    }
};

/**
 * Devuelve los seguidores del usuario
 */
const getFollowers = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await usersModel.findById(userId).populate('followers').select('followers -_id');

        if (!user) {
            handleHttpError(res, "Usuario no encontrado", 404);
            return;
        }

        res.send(user.followers);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "Error al obtener los seguidores", 500);
    }
};

/**
 * Devuelve los usuarios que le siguen 
 */
const getFollowing = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await usersModel.findById(userId).populate('following').select('following -_id');

        if (!user) {
            handleHttpError(res, "Usuario no encontrado", 404);
            return;
        }

        res.send(user.following);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "Error al obtener los seguidores", 500);
    }
};

/**
 * Devuelve los usuarios por filtro
 */
const getUsersByFilter = async (req, res) => {
    try {
        const { lookingFor, country, city, language } = req.query;

        let query = {};

        if (lookingFor === "colaborar") {
            query["config.search_projects"] = true;
        } else if (lookingFor === "invertir") {
            query["config.search_users"] = true;
        }
        else if (lookingFor === "") {
            query["config.search_users"] = true;
            query["config.search_projects"] = true;
        }

        if (language) {
            query["profile.languages"] = language;
        }

        if (country) {
            query["location.country"] = country;
        }

        if (city) {
            query["location.city"] = city;
        }

        const users = await usersModel.find(query);

        res.json(users.map(user => ({
            _id: user._id,
            name: user.name,
            image: user.image,
            location: {
                city: user.location?.city,
                country: user.location?.country
            }
        })));
    } catch (err) {
        console.error("Error al obtener usuarios por filtro:", err);
        handleHttpError(res, "Error al obtener usuarios por filtro", 500);
    }
};

/**
 * Devuelve un usuario por su ID.
 */
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const requestingUserId = req.user._id;

        const user = await usersModel.findById(userId).select('-password');
        const requestingUser = await usersModel.findById(requestingUserId);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const doesFollow = requestingUser.following.some(follow => follow.id.toString() === userId);

        const isFollowed = user.followers.some(follower => follower.id.toString() === requestingUserId);

        const userWithFollowInfo = user.toObject();
        userWithFollowInfo.follow = doesFollow;
        userWithFollowInfo.hefollows = isFollowed;

        res.status(200).send(userWithFollowInfo);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al obtener el usuario' });
    }
};

/**
 * Seguir a un usuario
 */
const followUser = async (req, res) => {
    const userId = req.user._id;
    const userToFollowId = req.params.id;

    try {
        const user = await usersModel.findById(userId, 'name image location');

        const userToFollow = await usersModel.findById(userToFollowId, 'name image location');

        const userFollowingInfo = {
            id: userToFollow._id,
            name: userToFollow.name,
            location: userToFollow.location,
            image: userToFollow.image,
        };

        const userFollowerInfo = {
            id: user._id,
            name: user.name,
            location: user.location,
            image: user.image,
        };

        await usersModel.findByIdAndUpdate(userId, {
            $addToSet: { following: userFollowingInfo }
        }, { new: true });

        await usersModel.findByIdAndUpdate(userToFollowId, {
            $addToSet: { followers: userFollowerInfo }
        }, { new: true });

        const notification = new notificationsModel({
            user_id: userToFollowId,
            direction: 'incoming',
            type: 'connection_request',
            from_user: userFollowerInfo,
            status: 'pending'
        });

        await notification.save();

        res.status(200).send({ message: 'Usuario seguido con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al seguir al usuario.' });
    }
};

/**
 * Dejar de seguir a un usuario
 */
const unfollowUser = async (req, res) => {
    const userId = req.user._id;
    const userToUnfollowId = req.params.id;

    try {
        const userExists = await usersModel.findById(userId);
        const userToUnfollowExists = await usersModel.findById(userToUnfollowId);

        if (!userExists || !userToUnfollowExists) {
            return res.status(404).send({ message: 'Uno de los usuarios no existe.' });
        }

        await usersModel.findByIdAndUpdate(userId, {
            $pull: { following: { id: userToUnfollowId } }
        }, { new: true });

        await usersModel.findByIdAndUpdate(userToUnfollowId, {
            $pull: { followers: { id: userId } }
        }, { new: true });

        res.status(200).send({ message: 'Has dejado de seguir al usuario con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al dejar de seguir al usuario.' });
    }
};

/**
 * Guardar un artículo
 */
const saveArticle = async (req, res) => {
    const userId = req.user._id;
    const article = req.body;

    try {
        const updatedUser = await usersModel.findByIdAndUpdate(
            userId,
            { $push: { saved_articles: article } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        res.status(200).send({ message: 'Artículo guardado con éxito', savedArticles: updatedUser.saved_articles });
    } catch (error) {
        res.status(500).send({ message: 'Error al guardar el artículo', error: error.message });
    }
};

/**
 * Devuelve los artículos guardados del usuario
 */
const getSavedArticles = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await usersModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const savedArticlesWithSaveFlag = user.saved_articles.map(article => ({
            ...article.toObject(),
            save: true
        }));

        res.status(200).send(savedArticlesWithSaveFlag);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener los artículos guardados', error: error.message });
    }
};

/**
 * Desguarda un artículo
 */
const unsaveArticle = async (req, res) => {
    const userId = req.user._id;
    const articleId = req.params.id;

    try {
        const updatedUser = await usersModel.findByIdAndUpdate(
            userId,
            { $pull: { saved_articles: { _id: articleId } } },
            { new: true }
        );

        console.log(updatedUser)

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }



        res.status(200).send({ message: 'Artículo desguardado con éxito', savedArticles: updatedUser.saved_articles });
    } catch (error) {
        res.status(500).send({ message: 'Error al desguardar el artículo', error: error.message });
    }
};

/**
 * Guarda un proyecto
 */
const saveProject = async (req, res) => {
    const userId = req.user._id;
    const projectId = req.params.id;

    try {
        const projectExists = await projectsModel.findById(projectId);
        if (!projectExists) {
            return res.status(404).send({ message: 'Proyecto no encontrado' });
        }

        await usersModel.findByIdAndUpdate(
            userId,
            { $addToSet: { saved_projects: { _id: projectId } } },
            { new: true }
        );

        res.status(200).send({ message: 'Proyecto guardado con éxito' });
    } catch (error) {
        res.status(500).send({ message: 'Error al guardar el proyecto', error: error.message });
    }
};

/**
 * Desguarda un proyecto
 */
const unsaveProject = async (req, res) => {
    const userId = req.user._id;
    const projectId = req.params.id;

    try {
        await usersModel.findByIdAndUpdate(
            userId,
            { $pull: { saved_projects: { _id: projectId } } },
            { new: true }
        );

        res.status(200).send({ message: 'Proyecto desguardado con éxito' });
    } catch (error) {
        res.status(500).send({ message: 'Error al desguardar el proyecto', error: error.message });
    }
};

/**
 * Devuelve los proyectos guardados
 */
const getSavedProjects = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await usersModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const projectIds = user.saved_projects.map(sp => sp._id.toString());

        const projects = await projectsModel.find({
            '_id': { $in: projectIds }
        });

        const projectsWithRequests = await Promise.all(projects.map(async (project) => {
            const projectJSON = project.toObject(); // Convertimos el documento de Mongoose a un objeto JavaScript

            const investmentRequest = await notificationsModel.findOne({
                user_id: project.creator, // Asume que el campo 'creator' es el ID del creador en el documento del proyecto
                "from_user.id": userId,
                project_id: project._id.toString(),
                type: 'investment_request',
                status: 'pending'
            });

            const collaborationRequest = await notificationsModel.findOne({
                user_id: project.creator,
                "from_user.id": userId,
                project_id: project._id.toString(),
                type: 'collaboration_request',
                status: 'pending'
            });

            projectJSON.investment_request = !!investmentRequest;
            projectJSON.collaboration_request = !!collaborationRequest;
            projectJSON.save = true; // Marcar el proyecto como guardado

            return projectJSON;
        }));

        res.status(200).send(projectsWithRequests);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener los proyectos guardados', error: error.message });
    }
};

/**
 * Buscar el usuario
 */
const searchUsers = async (req, res) => {
    try {
        const { name } = req.params;

        let searchQuery = {};

        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' };
        }

        const users = await usersModel.find(searchQuery);

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar artículos' });
    }
};



module.exports = { registerCtrl, loginCtrl, getProfile, editProfile, deleteUser, getFollowers, getFollowing, getUsersByFilter, getUserById, followUser, unfollowUser, saveArticle, getSavedArticles, unsaveArticle, saveProject, unsaveProject, getSavedProjects, searchUsers }