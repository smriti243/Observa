import React from "react";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const location = useLocation();
  const metricsData = location.state?.metricsData;

  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold mb-6">AWS Metrics Dashboard</h1>

      {!metricsData ? (
        <p>No data available.</p>
      ) : (
        Object.entries(metricsData).map(([metricName, datapoints]) => {
          // Format timestamps for better display
          const formattedData = datapoints.map((dp) => ({
            ...dp,
            Timestamp: new Date(dp.Timestamp).toLocaleTimeString(),
          }));

          return (
            <div key={metricName} className="mb-12">
              <h2 className="text-xl font-semibold mb-4">{metricName}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                  <Line type="monotone" dataKey="Average" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="Timestamp" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Dashboard;
