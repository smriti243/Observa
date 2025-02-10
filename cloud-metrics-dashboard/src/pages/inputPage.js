import { useState } from "react";
import axios from "axios";

function MetricForm({ onDataFetched }) {
    const [url, setUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/fetch-metrics", { url });
            onDataFetched(response.data); // Send data to parent component
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    return (
        <div>
            <h2>Enter Cloud URL / Instance ID</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter AWS Instance ID or URL"
                    required
                />
                <button type="submit">Fetch Metrics</button>
            </form>
        </div>
    );
}

export default MetricForm;
