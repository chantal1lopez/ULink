const ENGINE_DB = process.env.ENGINE_DB


const models = {
    usersModel: require('./users'),
    projectsModel: require('./project'),
    articlesModel: require('./article'),
    notificationsModel: require('./notification'),
    messageModel: require('./message'),
    chatModel: require('./chat'),

}

module.exports = models;