import React from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const metricsData = location.state?.metricsData;

  return (
    <div className="dashboard">
      <h1>AWS Metrics Dashboard</h1>
      {!metricsData ? (
        <p>No data available.</p>
      ) : (
        Object.entries(metricsData).map(([metricName, datapoints]) => (
          <div key={metricName} className="metric-card">
            <h3>{metricName}</h3>
            <ul>
              {datapoints.map((point, index) => (
                <li key={index}>
                  {new Date(point.Timestamp).toLocaleString()} — Avg:{" "}
                  {point.Average.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
