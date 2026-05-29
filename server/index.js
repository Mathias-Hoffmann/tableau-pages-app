import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Checkbox, Vehicle } from "./models.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://user:password@cluster.mongodb.net/paperless?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI).then(() => console.log("✅ MongoDB connected")).catch((err) => console.error("❌ MongoDB error:", err));

// Save checkbox state
app.post("/api/checkbox", async (req, res) => {
  try {
    const { rowKey, column, checked } = req.body;
    const result = await Checkbox.findOneAndUpdate(
      { rowKey, column },
      { rowKey, column, checked },
      { upsert: true, new: true }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save vehicle state
app.post("/api/vehicle", async (req, res) => {
  try {
    const { vehicleNumber, checked } = req.body;
    const result = await Vehicle.findOneAndUpdate(
      { vehicleNumber },
      { vehicleNumber, checked },
      { upsert: true, new: true }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all checkbox states
app.get("/api/checkboxes", async (req, res) => {
  try {
    const checkboxes = await Checkbox.find();
    const data = {};
    checkboxes.forEach((cb) => {
      data[`${cb.rowKey}-${cb.column}`] = cb.checked;
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all vehicle states
app.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const data = {};
    vehicles.forEach((v) => {
      data[v.vehicleNumber] = v.checked;
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
app.delete("/api/clear", async (req, res) => {
  try {
    await Checkbox.deleteMany();
    await Vehicle.deleteMany();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
