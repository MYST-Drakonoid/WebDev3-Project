import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// NEVER export the key — only use it internally.
const STEAM_KEY = process.env.STEAM_API_KEY;

// -------------------------------
// Get full Steam app list
// -------------------------------
app.get("/steam/apps", async (req, res) => {
    try {
        const url = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${STEAM_KEY}&include_dlc=false&max_results=10000`;

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Steam API failed", details: err.message });
    }
});

// -------------------------------
// Get Featured Games (no key required)
// -------------------------------
app.get("/steam/featured", async (req, res) => {
    try {
        const url = "https://store.steampowered.com/api/featured/";
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Featured API failed", details: err.message });
    }
});

// -------------------------------
// Health Check
// -------------------------------
app.get("/", (req, res) => {
    res.send("Steam API Proxy Running");
});

// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
