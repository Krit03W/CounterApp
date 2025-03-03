require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Failed:", err));

const CounterSchema = new mongoose.Schema({
    male_count: Number,
    female_count: Number,
    total_count: Number,
    timestamp: { type: Date, default: Date.now }
});
const Counter = mongoose.model("Counter", CounterSchema);

app.post("/save", async (req, res) => {
    const { male, female } = req.body;
    const newEntry = new Counter({ male_count: male, female_count: female, total_count: male + female });
    try {
        await newEntry.save();
        res.json({ message: "Data saved successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/logs", async (req, res) => {
    const { start, end } = req.query;
    try {
        const logs = await Counter.find({
            timestamp: { $gte: new Date(start), $lte: new Date(end) }
        }).sort({ timestamp: -1 });

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
