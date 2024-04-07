const { matchedData } = require("express-validator")
const { tokenSign } = require("../utils/handleJwt")
const { encrypt, compare } = require("../utils/handlePassword")
const { handleHttpError } = require("../utils/handleError")
const { notificationsModel, projectsModel, usersModel } = require("../models")

/**
 * Crea una notificación
 */
const createNotification = async (req, res) => {
  try {
    if (['collaboration_request', 'investment_request'].includes(req.body.type) && req.body.project_id) {
      const project = await projectsModel.findById(req.body.project_id);
      if (!project) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
      }
      req.body.user_id = project.creator;
    }

    const newNotification = new notificationsModel(req.body);
    const savedNotification = await newNotification.save();

    global.io.to(req.body.user_id.toString()).emit('notification', "message");

    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(400).json({ message: "Error al crear la notificación", error });
  }
};

/**
 * Actualiza una notificación
 */
const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedNotification = await notificationsModel.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la notificación", error });
  }
};

/**
 *  Devuelve las notificaciones enviadas
 */
const getSentNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const notifications = await notificationsModel.find({ "from_user.id": userId });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener las notificaciones enviadas", error });
  }
};

/**
 * Devuelve las notificaciones solicitadas
 */
const getReceivedNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const notifications = await notificationsModel.find({ user_id: userId });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener las notificaciones recibidas", error });
  }
};

/**
 * Añade colaboradores o inversores al proyecto
 */
const addUserToProject = async (req, res) => {
  const { projectId, userId, type } = req.body;

  console.log(userId);

  try {
    const user = await usersModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const participant = {
      id: user._id,
      name: user.name,
      image: user.image,
      location: {
        city: user.city || '',
        country: user.country || ''
      }
    };

    const update = type === 'collaboration_request'
      ? { $push: { collaborators: participant } }
      : { $push: { investors: participant } };

    const project = await projectsModel.findByIdAndUpdate(projectId, update, { new: true });

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir el usuario al proyecto', error: error.message });
  }
};


module.exports = { createNotification, updateNotification, getSentNotifications, getReceivedNotifications, addUserToProject }