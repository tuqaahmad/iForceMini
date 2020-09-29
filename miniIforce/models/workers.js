const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true
    },

    salary: {
        type: String,
        required: true
    }


}, {timestamps: true});

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;

