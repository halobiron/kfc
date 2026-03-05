const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'OTHER']
    },
    resource: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
