const mongoose = require('mongoose');


exports.connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_LOCAL_URI)
            .then(con => console.log('Database is connected'));
    } catch (error) {
        console.log(error)
    }
}
