import { useState } from "react";
import MetricForm from "./components/MetricForm";

function App() {
    const [metrics, setMetrics] = useState(null);

    return (
        <div>
            <h1>Cloud Metrics Dashboard</h1>
            <MetricForm onDataFetched={setMetrics} />
            {metrics && (
                <div>
                    <h3>Performance Metrics</h3>
                    <pre>{JSON.stringify(metrics, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
