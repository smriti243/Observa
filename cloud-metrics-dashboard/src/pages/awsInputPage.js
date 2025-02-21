import { useState } from "react";
import "./awsInputPage.css";
import { useNavigate } from "react-router-dom";

const metricCategories = {
  "System Performance": ["CPUUtilization", "MemoryUtilization", "NetworkIn", "NetworkOut", "DiskReadOps", "DiskWriteOps"],
  "Application Monitoring": ["RequestCount", "Latency", "4xxErrorRate", "5xxErrorRate", "ThrottledRequests"],
  "Security & Access": ["UnauthorizedAccessAttempts", "IAMPolicyChanges", "DDoSAttackAlerts", "CloudTrailEventCount"],
  "Business Metrics": ["UserSignups", "TransactionsCompleted", "ActiveUsers", "FeatureUsage"],
};

function AwsInputPage() {
  const [roleArn, setRoleArn] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [timeRange, setTimeRange] = useState("last_1_hour");
  const [openCategories, setOpenCategories] = useState({}); // Track which categories are expanded

  const navigate = useNavigate();

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleMetricSelection = (metric) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const fetchMetrics = async () => {
    const startTime = new Date();
    if (timeRange === "last_1_hour") startTime.setHours(startTime.getHours() - 1);
    else if (timeRange === "last_24_hours") startTime.setHours(startTime.getHours() - 24);

    const response = await fetch("http://localhost:5000/fetch-metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleArn, instanceId, metrics: selectedMetrics, startTime, endTime: new Date() }),
    });

    const data = await response.json();
    if (response.ok) {
      navigate("/dashboard", { state: { metricsData: data.data } });
    } else {
      alert("Failed to fetch metrics.");
    }
  };

  return (
    <div className="background min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex items-center justify-center">
      <div className="floating_box w-[400px] p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Fetch AWS Metrics</h2>
        
        <input 
          type="text" placeholder="IAM Role ARN" 
          value={roleArn} onChange={(e) => setRoleArn(e.target.value)} required 
          className="w-full p-2 rounded-md bg-gray-700 mb-2"
        />
        
        <input 
          type="text" placeholder="Instance ID" 
          value={instanceId} onChange={(e) => setInstanceId(e.target.value)} required 
          className="w-full p-2 rounded-md bg-gray-700 mb-4"
        />

        {/* Metrics Selection */}
        <div className="mb-4">
          <label className="text-lg font-semibold">Select Metrics:</label>
          {Object.entries(metricCategories).map(([category, metrics]) => (
            <div key={category} className="mt-2">
              <button 
                onClick={() => toggleCategory(category)}
                className="w-full text-left bg-gray-700 p-2 rounded-md flex justify-between"
              >
                {category} {openCategories[category] ? "▲" : "▼"}
              </button>

              {openCategories[category] && (
                <div className="pl-4 mt-2 space-y-1">
                  {metrics.map((metric) => (
                    <label key={metric} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" value={metric} 
                        checked={selectedMetrics.includes(metric)}
                        onChange={() => handleMetricSelection(metric)}
                      />
                      <span>{metric}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Time Range Selection */}
        <div className="mb-4">
          <label className="text-lg font-semibold">Select Time Range:</label>
          <select 
            value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700"
          >
            <option value="last_1_hour">Last 1 Hour</option>
            <option value="last_24_hours">Last 24 Hours</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Fetch Button */}
        <button 
          onClick={fetchMetrics} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
        >
          Fetch Metrics
        </button>
      </div>
    </div>
  );
}

export default AwsInputPage;
