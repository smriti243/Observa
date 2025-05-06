const express = require("express");
const router = express.Router();
const { getCloudWatchMetrics } = require("../services/awsService");
const { getMetricHistory } = require("../controllers/metricController");

router.get("/history", getMetricHistory);

router.post("/fetch-metrics", async (req, res) => {
  try {
    const { roleArn, instanceId, metrics, startTime, endTime } = req.body;

    if (!roleArn || !instanceId || !metrics || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Now assume you have a utility function that fetches metrics
    const metricsData = await getCloudWatchMetrics({
      roleArn,
      instanceId,
      metrics,
      startTime,
      endTime,
    });

    return res.status(200).json({ data: metricsData });
  } catch (error) {
    console.error("Error fetching AWS metrics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/forecast", async (req, res) => {
  try {
    const metric = req.query.metric;
    if (!metric) {
      return res.status(400).json({ error: "Metric query parameter is required" });
    }

    // Dummy forecast logic — you can replace this with your own algorithm later
    const forecastData = [
      { timestamp: new Date(), predictedValue: 42 },
      { timestamp: new Date(Date.now() + 3600000), predictedValue: 45 },
      { timestamp: new Date(Date.now() + 2 * 3600000), predictedValue: 48 },
    ];

    return res.status(200).json({ forecast: forecastData });
  } catch (error) {
    console.error("Forecast error:", error);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});


module.exports = router;
