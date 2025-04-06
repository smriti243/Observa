import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Dashboard() {
  const location = useLocation();
  const metricsData = location.state?.metricsData;
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const [alertSent, setAlertSent] = useState({});

  const getColorByValue = (metricName, value) => {
    const thresholds = {
      CPUUtilization: [50, 80],
      MemoryUtilization: [60, 85],
      NetworkIn: [500000, 900000],
      NetworkOut: [500000, 900000],
      DiskReadOps: [200, 500],
      DiskWriteOps: [200, 500],
      RequestCount: [100, 1000],
      Latency: [100, 300],
      "4xxErrorRate": [1, 5],
      "5xxErrorRate": [0.5, 2],
      ThrottledRequests: [10, 50],
      UnauthorizedAccessAttempts: [1, 5],
      IAMPolicyChanges: [1, 3],
      DDoSAttackAlerts: [1, 2],
      CloudTrailEventCount: [1000, 5000],
      UserSignups: [50, 200],
      TransactionsCompleted: [100, 500],
      ActiveUsers: [1000, 5000],
      FeatureUsage: [100, 1000],
    };



    const [green, yellow] = thresholds[metricName] || [50, 80];

    if (value < green) return "border-green-500";
    if (value < yellow) return "border-yellow-400";
    return "border-red-500";
  };

  const getDefaultThreshold = (metricName) => {
    const thresholds = {
      CPUUtilization: 80,
      MemoryUtilization: 85,
      NetworkIn: 900000,
      NetworkOut: 900000,
      DiskReadOps: 500,
      DiskWriteOps: 500,
      RequestCount: 1000,
      Latency: 300,
      "4xxErrorRate": 5,
      "5xxErrorRate": 2,
      ThrottledRequests: 50,
      UnauthorizedAccessAttempts: 5,
      IAMPolicyChanges: 3,
      DDoSAttackAlerts: 2,
      CloudTrailEventCount: 5000,
      UserSignups: 200,
      TransactionsCompleted: 500,
      ActiveUsers: 5000,
      FeatureUsage: 1000,
    };
    return thresholds[metricName] || 100;
  };

  const sendEmailAlert = (metricName, value, threshold) => {
    const templateParams = {
      to_name: "Admin", // or any recipient name
      metric: metricName,
      value: value.toFixed(2),
      threshold: threshold,
      message: `Alert! ${metricName} exceeded threshold. Current value: ${value}, Threshold: ${threshold}`,
    };

    emailjs
      .send(
        "service_4wwevlm",
        "template_vg2q6et",
        templateParams,
        "ya-YIchO5WvzoHKN-l"
      )
      .then(
        (response) => {
          console.log("Email alert sent:", response.status, response.text);
        },
        (error) => {
          console.error("Failed to send email alert:", error);
        }
      );
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSettings = () => setShowSettings((prev) => !prev);

  useEffect(() => {
    if (!metricsData) return;

    Object.entries(metricsData).forEach(([metricName, datapoints]) => {
      const avgValue =
        datapoints.reduce((acc, dp) => acc + dp.Average, 0) / datapoints.length;

      const threshold =
        alertConfig[metricName] || getDefaultThreshold(metricName);

      if (avgValue > threshold && !alertSent[metricName]) {
        sendEmailAlert(metricName, avgValue, threshold);
        setAlertSent((prev) => ({ ...prev, [metricName]: true }));

        // Optional: reset alert after some time
        setTimeout(() => {
          setAlertSent((prev) => ({ ...prev, [metricName]: false }));
        }, 10 * 60 * 1000); // reset after 10 minutes
      }
    });
  }, [metricsData, alertConfig]);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen p-6 transition-colors`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AWS Metrics Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={toggleSettings}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-400 transition"
          >
            ⚙ Alert Settings
          </button>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* ⚙ Alert Settings Section */}
      {showSettings && (
        <div
          className={`mb-6 p-4 rounded ${
            darkMode ? "bg-gray-800" : "bg-yellow-100"
          } border border-yellow-500`}
        >
          <h2 className="text-xl font-semibold mb-3 text-yellow-900 dark:text-yellow-300">
            🔔 Custom Alert Thresholds
          </h2>
          {Object.keys(metricsData || {}).map((metric) => (
            <div key={metric} className="mb-3 flex gap-4 items-center">
              <label className="w-48 text-sm font-medium">{metric}</label>
              <input
                type="number"
                placeholder="Set threshold"
                value={alertConfig[metric] || ""}
                onChange={(e) =>
                  setAlertConfig((prev) => ({
                    ...prev,
                    [metric]: Number(e.target.value),
                  }))
                }
                className="border px-3 py-1 rounded w-32 text-black"
              />
              <button
                onClick={() =>
                  alert(`Threshold for ${metric} set to ${alertConfig[metric]}`)
                }
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition"
              >
                Set
              </button>
            </div>
          ))}
        </div>
      )}

      {!metricsData ? (
        <p>No data available.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {Object.entries(metricsData).map(([metricName, datapoints]) => {
            const formattedData = datapoints.map((dp) => ({
              ...dp,
              Timestamp: new Date(dp.Timestamp).toLocaleTimeString(),
            }));

            const avgValue =
              datapoints.reduce((acc, dp) => acc + dp.Average, 0) /
              datapoints.length;

            const borderColor = getColorByValue(metricName, avgValue);

            return (
              <div
                key={metricName}
                className={`p-4 rounded-xl shadow-md border-4 ${borderColor} ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <h2 className="text-xl font-semibold mb-4">{metricName}</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={formattedData}>
                    <CartesianGrid
                      stroke={darkMode ? "#555" : "#ccc"}
                      strokeDasharray="5 5"
                    />
                    <XAxis dataKey="Timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Average"
                      stroke={
                        borderColor === "border-green-500"
                          ? "#22c55e"
                          : borderColor === "border-yellow-400"
                          ? "#eab308"
                          : "#ef4444"
                      }
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
