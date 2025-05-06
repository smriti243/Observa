import pandas as pd
import matplotlib.pyplot as plt
from prophet import Prophet
from pymongo import MongoClient
import sys

# === INPUT FROM BUTTON CLICK ===
metric = sys.argv[1]  # e.g. "CPUUtilization"
instance_id = sys.argv[2]  # e.g. "i-123456"

# === CONNECT TO MONGODB ===
client = MongoClient("mongodb://localhost:27017/")
db = client["your_db_name"]
collection = db["metrics"]  # or whatever you named it

# === FETCH METRIC DATA ===
data = list(collection.find({"metricName": metric, "instanceId": instance_id}))
df = pd.DataFrame(data)

if df.empty:
    print("No data found.")
    sys.exit()

# === PREPARE DATA ===
df = df[["timestamp", "average"]]
df.columns = ["ds", "y"]
df["ds"] = pd.to_datetime(df["ds"])

# === PROPHET FORECASTING ===
model = Prophet()
model.fit(df)

future = model.make_future_dataframe(periods=6, freq='H')  # next 6 hours
forecast = model.predict(future)

# === PLOT RESULT ===
fig = model.plot(forecast)
plt.title(f"Forecast for {metric}")
plt.savefig("forecast_output.png")  # save plot

print("Forecast complete.")
