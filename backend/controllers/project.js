const { handleHttpError } = require("../utils/handleError")
const { projectsModel, notificationsModel, usersModel } = require("../models")


/**
 * Crea un nuevo proyecto en la base de datos
 */
const createProject = async (req, res) => {
    try {
        const projectData = req.body;

        projectData.creator = req.user._id;
        const newProject = await projectsModel.create(projectData);

        res.status(201).json(newProject);
    } catch (err) {
        console.error("Error al crear el proyecto:", err);
        res.status(500).json({ message: "Error al crear el proyecto", error: err });
    }
};

/**
 * Devuelve todos los proyectos asociados a un usuario específico.
 */
const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await projectsModel.find({ creator: userId });

        res.json(projects);
    } catch (err) {
        console.error("Error al obtener los proyectos del usuario:", err);
        res.status(500).json({ message: "Error al obtener los proyectos del usuario", error: err });
    }
};

/**
 * Elimina un proyecto por su ID.
 */
const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await projectsModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }

        if (project.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "No autorizado para eliminar este proyecto" });
        }

        await projectsModel.findByIdAndDelete(projectId);

        res.json({ message: "Proyecto eliminado con éxito" });
    } catch (err) {
        console.error("Error al eliminar el proyecto:", err);
        res.status(500).json({ message: "Error al eliminar el proyecto", error: err });
    }
};

/**
 * Edita (actualiza) un proyecto por su ID.
 */
const editProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const updates = req.body;

        const project = await projectsModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }

        if (project.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "No autorizado para editar este proyecto" });
        }

        const updatedProject = await projectsModel.findByIdAndUpdate(projectId, updates, { new: true });

        res.json(updatedProject);
    } catch (err) {
        console.error("Error al editar el proyecto:", err);
        res.status(500).json({ message: "Error al editar el proyecto", error: err });
    }
};

/**
 * Filtra proyectos basándose en criterios específicos.
 */
const filterProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type, country, city, category } = req.query;

        let query = {};

        if (type) {
            const types = type.split(',');
            query.$or = types.map(t => {
                switch (t) {
                    case 'invertir':
                        return { search_investors: true };
                    case 'colaborar':
                        return { search_collaborators: true };
                    case 'cerrados':
                        return { close: true };
                    default:
                        return {};
                }
            }).filter(t => Object.keys(t).length > 0);
        }

        if (country) query['location.country'] = country;
        if (city) query['location.city'] = city;
        if (category) query.categories = { $in: category.split(',') };

        const projects = await projectsModel.find(query);

        const user = await usersModel.findById(userId);
        const savedProjectIds = user.saved_projects.map(project => project._id.toString());
        console.log(savedProjectIds);

        const projectsWithInfo = await Promise.all(projects.map(async (project) => {
            const projectJSON = project.toJSON();

            const investmentRequest = await notificationsModel.findOne({
                user_id: project.creator,
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
            projectJSON.save = savedProjectIds.includes(project._id.toString());

            return projectJSON;
        }));

        res.json(projectsWithInfo);
    } catch (err) {
        console.error("Error al filtrar proyectos:", err);
        res.status(500).json({ message: "Error al filtrar proyectos", error: err });
    }
};


/**
 * Devuelve los proyectos de un usuario en concreto
 */
const getOtherUserProjects = async (req, res) => {
    try {
        const userId = req.params.userId;
        const requestingUserId = req.user._id;

        const projects = await projectsModel.find({ creator: userId });

        const requestingUser = await usersModel.findById(requestingUserId);
        const savedProjectsIds = requestingUser.saved_projects.map(sp => sp._id.toString());

        const projectsWithRequestsAndSavedStatus = await Promise.all(projects.map(async (project) => {
            const projectJSON = project.toJSON();

            const investmentRequest = await notificationsModel.findOne({
                user_id: userId,
                "from_user.id": requestingUserId,
                project_id: project._id.toString(),
                type: 'investment_request',
                status: 'pending'
            });

            const collaborationRequest = await notificationsModel.findOne({
                user_id: userId,
                "from_user.id": requestingUserId,
                project_id: project._id.toString(),
                type: 'collaboration_request',
                status: 'pending'
            });

            projectJSON.investment_request = !!investmentRequest;
            projectJSON.collaboration_request = !!collaborationRequest;

            projectJSON.save = savedProjectsIds.includes(project._id.toString());

            return projectJSON;
        }));

        res.json(projectsWithRequestsAndSavedStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los proyectos del usuario' });
    }
};

/**
 * Busqueda de proyectos
 */
const searchProjects = async (req, res) => {
    try {
        const { name } = req.params;
        const requestingUserId = req.user._id;

        let searchQuery = {};

        if (name) {
            searchQuery.name = { $regex: name, $options: 'i' };
        }

        const projects = await projectsModel.find(searchQuery);

        if (!projects) {
            console.log("No se encontro nada")
            return []
        }

        const requestingUser = await usersModel.findById(requestingUserId);
        const savedProjectsIds = requestingUser.saved_projects.map(sp => sp._id.toString());

        const projectsWithRequestsAndSavedStatus = await Promise.all(projects.map(async (project) => {
            const projectJSON = project.toJSON();

            const investmentRequest = await notificationsModel.findOne({
                user_id: project.creator,
                "from_user.id": requestingUserId,
                project_id: project._id.toString(),
                type: 'investment_request',
                status: 'pending'
            });

            const collaborationRequest = await notificationsModel.findOne({
                user_id: project.creator,
                "from_user.id": requestingUserId,
                project_id: project._id.toString(),
                type: 'collaboration_request',
                status: 'pending'
            });

            projectJSON.investment_request = !!investmentRequest;
            projectJSON.collaboration_request = !!collaborationRequest;
            projectJSON.save = savedProjectsIds.includes(project._id.toString());

            return projectJSON;
        }));

        res.json(projectsWithRequestsAndSavedStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar proyectos' });
    }
};


module.exports = { createProject, getUserProjects, deleteProject, editProject, filterProjects, getOtherUserProjects, searchProjects }