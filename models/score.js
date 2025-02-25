const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    week: {
        type: Number,
        require: true
    },
    punctuality: {
        type: Number,
        require: true
    },
    assignment: {
        type: Number,
        require: true
    },
    attendance: {
        type: Number,
        require: true
    },
    classAssessment: {
        type: Number,
        require: true
    },
    personalDefence: {
        type: Number,
        require: true
    },
    total: {
        type: Number,
        require: true
    },
    average: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Users', 
        require: true
    },
    name: {
        type: String,
        require: true
    },

}, {timestamps: true});

const scoreModel = mongoose.model('scores', scoreSchema);

module.exports = scoreModel;