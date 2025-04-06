const {
    CloudWatchClient,
    GetMetricStatisticsCommand,
} = require("@aws-sdk/client-cloudwatch");
const Metric = require("../models/metricModel");

const getCloudWatchMetrics = async ({ instanceId, startTime, endTime, metrics }) => {
    // CloudWatch client will automatically use environment variables:
    // AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
    const cloudWatchClient = new CloudWatchClient({});

    const start = new Date(startTime);
    const end = new Date(endTime);
    const period = 300; // 5 minutes

    const allGroupedData = {};

    for (const metricName of metrics) {
        const params = {
            Namespace: "AWS/EC2",
            MetricName: metricName,
            Dimensions: [
                {
                    Name: "InstanceId",
                    Value: instanceId,
                },
            ],
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
            average: dp.Average,
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        await Metric.insertMany(formattedData);

        allGroupedData[metricName] = formattedData.map(({ timestamp, average }) => ({
            Timestamp: timestamp,
            Average: average,
        }));
    }

    return allGroupedData;
};

module.exports = { getCloudWatchMetrics };
