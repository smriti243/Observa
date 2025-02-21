require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

AWS.config.update({ region: process.env.AWS_REGION });

app.post("/fetch-metrics", async (req, res) => {
    const { roleArn, instanceId, metrics, startTime, endTime } = req.body;

    if (!roleArn || !instanceId || !metrics || metrics.length === 0) {
        return res.status(400).json({ error: "Missing required parameters." });
    }

    const sts = new AWS.STS();

    try {
        // Assume IAM Role
        const assumedRole = await sts.assumeRole({
            RoleArn: roleArn,
            RoleSessionName: "MetricsSession",
        }).promise();

        const { AccessKeyId, SecretAccessKey, SessionToken } = assumedRole.Credentials;

        // Initialize CloudWatch with temporary credentials
        const cloudwatch = new AWS.CloudWatch({
            accessKeyId: AccessKeyId,
            secretAccessKey: SecretAccessKey,
            sessionToken: SessionToken,
            region: process.env.AWS_REGION,
        });

        // Fetch Metrics from CloudWatch
        const fetchMetricData = async (metricName) => {
            return cloudwatch.getMetricStatistics({
                Namespace: "AWS/EC2",
                MetricName: metricName,
                Dimensions: [{ Name: "InstanceId", Value: instanceId }],
                StartTime: new Date(startTime), // Convert from user input
                EndTime: new Date(endTime),     // Convert from user input
                Period: 300, // 5-minute intervals
                Statistics: ["Average"],
            }).promise();
        };

        // Fetch all selected metrics
        const metricPromises = metrics.map(fetchMetricData);
        const metricResults = await Promise.all(metricPromises);

        // Format response
        const responseData = metrics.reduce((acc, metricName, index) => {
            acc[metricName] = metricResults[index].Datapoints;
            return acc;
        }, {});

        res.json({ message: "Metrics fetched successfully!", data: responseData });
    } catch (error) {
        console.error("Error fetching metrics:", error);
        res.status(500).json({ error: "Failed to fetch AWS metrics.", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const moment = require("moment");

// const app = express();
// app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:3000",  // Allow frontend's origin
// }));


// const getMockData = (metricName, startTime, endTime) => {
//     // Create fake data points for a given metric within the time range
//     const timeRangeInMinutes = moment(endTime).diff(moment(startTime), "minutes");
//     const dataPoints = [];

//     for (let i = 0; i < timeRangeInMinutes / 5; i++) {
//         const timestamp = moment(startTime).add(i * 5, "minutes").toISOString();
//         let value = 0;

//         // Simulating fake values for different metrics
//         switch (metricName) {
//             case "CPUUtilization":
//                 value = Math.random() * 100; // Simulate CPU usage percentage (0-100)
//                 break;
//             case "NetworkIn":
//                 value = Math.random() * 1000; // Simulate network traffic in bytes (0-1000)
//                 break;
//             case "NetworkOut":
//                 value = Math.random() * 1000; // Simulate network traffic in bytes (0-1000)
//                 break;
//             case "DiskReadOps":
//                 value = Math.random() * 500; // Simulate disk read operations (0-500)
//                 break;
//             default:
//                 value = Math.random() * 100;
//         }

//         dataPoints.push({
//             Timestamp: timestamp,
//             Average: value.toFixed(2), // Simulate average value for the metric
//         });
//     }

//     return dataPoints;
// };

// app.post("/fetch-metrics", async (req, res) => {
//     const { roleArn, instanceId, metrics, startTime, endTime } = req.body;

//     if (!roleArn || !instanceId || !metrics || metrics.length === 0) {
//         return res.status(400).json({ error: "Missing required parameters." });
//     }

//     try {
//         // Mock data for each selected metric
//         const metricResults = metrics.map((metricName) => ({
//             [metricName]: getMockData(metricName, startTime, endTime),
//         }));

//         // Format response with fake data
//         const responseData = metricResults.reduce((acc, result) => {
//             const metricName = Object.keys(result)[0];
//             acc[metricName] = result[metricName];
//             return acc;
//         }, {});

//         res.json({ message: "Metrics fetched successfully!", data: responseData });
//     } catch (error) {
//         console.error("Error fetching metrics:", error);
//         res.status(500).json({ error: "Failed to fetch metrics.", details: error.message });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
