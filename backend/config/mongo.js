const mongoose = require('mongoose')

const dbConnect = async () => {
    try {
        const db_uri = process.env.DB_URI;
        mongoose.set('strictQuery', false);
        await mongoose.connect(db_uri);
        console.log("Conectado a la BD");
    } catch (err) {
        console.error("No se ha podido establecer la conexión a la BD", err);
    }
};

module.exports = { dbConnect };
