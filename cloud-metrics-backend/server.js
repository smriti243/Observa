require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const metricRoutes = require("./Routes/metricRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/metrics", metricRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB Connection Error:", err));

app.use("/api", metricRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
