import { useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function Dashboard() {
    const location = useLocation();
    const metricsData = location.state?.metricsData || {};

    return (
        <div>
            <h2>Performance Metrics Dashboard</h2>

            {Object.keys(metricsData).map((metricName) => (
                <div key={metricName}>
                    <h3>{metricName}</h3>
                    <LineChart width={600} height={300} data={metricsData[metricName]}>
                        <XAxis dataKey="Timestamp" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#ccc" />
                        <Line type="monotone" dataKey="Average" stroke="#8884d8" />
                    </LineChart>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
