const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
    metricName: String,
    timestamp: Date,
    average: Number,
});

module.exports = mongoose.model('Metric', metricSchema);
