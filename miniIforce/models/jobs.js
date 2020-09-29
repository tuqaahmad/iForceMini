const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobsSchema = new Schema({
    jobname: {
        type: String,
        required: true
    }


}, {timestamps: true});

const Jobs = mongoose.model('Jobs', jobsSchema);
module.exports = Jobs;

