const express = require("express");
const router = express.Router();
const { getCloudWatchMetrics } = require("../services/awsService");
const { getMetricHistory } = require("../controllers/metricController");
const MetricModel = require("../models/metricModel");
const moment = require("moment");

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

function linearRegression(data) {
  const n = data.length;
  const sumX = data.reduce((acc, d, i) => acc + i, 0);
  const sumY = data.reduce((acc, d) => acc + d.value, 0);
  const sumXY = data.reduce((acc, d, i) => acc + i * d.value, 0);
  const sumXX = data.reduce((acc, d, i) => acc + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return (x) => slope * x + intercept;
}

router.get("/forecast", async (req, res) => {
  try {
    const metric = req.query.metric;
    if (!metric) {
      return res
        .status(400)
        .json({ error: "Metric query parameter is required" });
    }

    const history = await MetricModel.find({ metricName: metric })
      .sort({ timestamp: -1 })
      .limit(20);

    if (!history || history.length < 5) {
      return res
        .status(400)
        .json({ error: "Not enough historical data to forecast" });
    }

    const sorted = history.reverse().map((doc) => ({
      timestamp: doc.timestamp,
      value: doc.average, // Use the 'average' field here
    }));

    const predict = linearRegression(sorted);

    const forecastData = [];
    const lastTime = moment(sorted[sorted.length - 1].timestamp);

    for (let i = 1; i <= 5; i++) {
      const futureTime = lastTime.clone().add(i, "hours").toDate();
      forecastData.push({
        timestamp: futureTime,
        predictedValue: predict(sorted.length + i - 1),
      });
    }

    return res.status(200).json({ forecast: forecastData });
  } catch (error) {
    console.error("Forecast error:", error);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});


module.exports = router;
