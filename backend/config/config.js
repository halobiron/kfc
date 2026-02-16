const mongoose = require('mongoose');


exports.connectDatabase = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect(process.env.DB_URI || process.env.DB_LOCAL_URI)
            .then(con => console.log('Database is connected'));
    } catch (error) {
        console.log(error)
    }
}
