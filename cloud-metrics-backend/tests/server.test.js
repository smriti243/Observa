const request = require("supertest");
const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const app = require("../server"); // Ensure this exports `app` from your main file

describe("AWS CloudWatch Mock Tests", () => {
    beforeAll(() => {
        // Mock STS AssumeRole response
        AWSMock.mock("STS", "assumeRole", (params, callback) => {
            callback(null, {
                Credentials: {
                    AccessKeyId: "mock-access-key",
                    SecretAccessKey: "mock-secret-key",
                    SessionToken: "mock-session-token",
                },
            });
        });

        // Mock CloudWatch getMetricStatistics response
        AWSMock.mock("CloudWatch", "getMetricStatistics", (params, callback) => {
            callback(null, {
                Datapoints: [
                    { Timestamp: new Date().toISOString(), Average: Math.random() * 100 },
                    { Timestamp: new Date(Date.now() - 60000).toISOString(), Average: Math.random() * 100 },
                ],
            });
        });
    });

    afterAll(() => {
        AWSMock.restore(); // Restore original AWS SDK behavior
    });

    test("Fetch mocked AWS CloudWatch metrics", async () => {
        const response = await request(app)
            .post("/fetch-metrics")
            .send({
                roleArn: "arn:aws:iam::123456789012:role/mock-role",
                instanceId: "i-1234567890abcdef0",
                metrics: ["CPUUtilization"],
                startTime: new Date(Date.now() - 3600000).toISOString(), // Last 1 hour
                endTime: new Date().toISOString(),
            });

        expect(response.status).toBe(200);
        expect(response.body.data.CPUUtilization).toBeDefined();
        expect(response.body.message).toBe("Metrics fetched successfully!");
    });
});
