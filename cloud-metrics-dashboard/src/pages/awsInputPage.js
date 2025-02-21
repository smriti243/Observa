import { useState } from "react";
import './awsInputPage.css';
import { useNavigate } from "react-router-dom";

function AwsInputPage() {
    const [roleArn, setRoleArn] = useState("");
    const [instanceId, setInstanceId] = useState("");
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [timeRange, setTimeRange] = useState("last_1_hour");


    const navigate = useNavigate();

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
        <div className=" background min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="floating_box">
        <h2 className="heading">Fetch AWS Metrics</h2>
        <input type="text" placeholder="IAM Role ARN" value={roleArn} onChange={(e) => setRoleArn(e.target.value)} required />
        <input type="text" placeholder="Instance ID" value={instanceId} onChange={(e) => setInstanceId(e.target.value)} required />

        <div>
            <label>Select Metrics:</label>
            {["CPUUtilization", "NetworkIn", "NetworkOut", "DiskReadOps"].map((metric) => (
                <label key={metric}>
                    <input type="checkbox" value={metric} onChange={(e) => {
                        if (e.target.checked) setSelectedMetrics([...selectedMetrics, metric]);
                        else setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
                    }} />
                    {metric}
                </label>
            ))}
        </div>

        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="last_1_hour">Last 1 Hour</option>
            <option value="last_24_hours">Last 24 Hours</option>
        </select>

        <button onClick={fetchMetrics}>Fetch Metrics</button>
        </div>
    </div>
    );
}

export default AwsInputPage;

