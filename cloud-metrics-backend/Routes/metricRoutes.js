const express = require("express");
const router = express.Router();
const { getCloudWatchMetrics } = require("../services/awsservice");

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



module.exports = router;
