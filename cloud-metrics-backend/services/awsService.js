const { CloudWatchClient, GetMetricStatisticsCommand } = require("@aws-sdk/client-cloudwatch");
const Metric = require("../models/metricModel");

const getCloudWatchMetrics = async ({ instanceId, startTime, endTime, metrics, windowSize }) => {
    const cloudWatchClient = new CloudWatchClient({});
    const start = new Date(startTime);
    const end = new Date(endTime);
    const period = 300;
    const allGroupedData = {};

    const slidingWindowAvg = (dataPoints, windowSize) => {
        let averages = [];
        for (let i = windowSize - 1; i < dataPoints.length; i++) {
            const window = dataPoints.slice(i - windowSize + 1, i + 1);
            const avg = window.reduce((sum, dp) => sum + dp.Average, 0) / window.length;
            averages.push({ ...dataPoints[i], Average: avg });
        }
        return averages;
    };

    for (const metricName of metrics) {
        const params = {
            Namespace: "AWS/EC2",
            MetricName: metricName,
            Dimensions: [{ Name: "InstanceId", Value: instanceId }],
            StartTime: start,
            EndTime: end,
            Period: period,
            Statistics: ["Average"],
        };

        const command = new GetMetricStatisticsCommand(params);
        const response = await cloudWatchClient.send(command);

        const formattedData = response.Datapoints.map((dp) => ({
            metricName,
            timestamp: dp.Timestamp,
            Average: dp.Average,
            instanceId,
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const slidingData = slidingWindowAvg(formattedData, windowSize);

        try {
            await Metric.insertMany(slidingData);
        } catch (err) {
            console.error("Failed to save metrics to MongoDB:", err);
        }

        allGroupedData[metricName] = slidingData.map(({ timestamp, Average }) => ({
            Timestamp: timestamp,
            Average,
        }));
    }

    return allGroupedData;
};

module.exports = { getCloudWatchMetrics };
