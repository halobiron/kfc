const mongoose = require('mongoose');

const { Schema } = mongoose;

const staffSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    position: {
        type: String,
        enum: ['manager', 'cashier', 'kitchen', 'delivery', 'customer-service'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    salary: Number,
    workSchedule: [
        {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            startTime: String,
            endTime: String,
            _id: false
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    performanceRating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
