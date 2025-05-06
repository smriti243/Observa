// controllers/metricController.js
const Metric = require("../models/metricModel");

const getMetricHistory = async (req, res) => {
  const { metricName, instanceId, limit = 20 } = req.query;

  try {
    const data = await Metric.find({ metricName, instanceId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(data.reverse()); // Return in ascending order
  } catch (err) {
    console.error("Error fetching metric history:", err);
    res.status(500).json({ error: "Failed to fetch metric history" });
  }
};

module.exports = { getMetricHistory };
