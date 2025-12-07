import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const STEAM_KEY = process.env.STEAM_API_KEY;

// -------------------------------
// Simple in-memory cache for appdetails (persists until restart)
// -------------------------------
const appDetailsCache = new Map();

// -------------------------------
// Get full Steam app list
// -------------------------------
app.get("/steam/apps", async (req, res) => {
    try {
        const url = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${STEAM_KEY}&include_dlc=false&max_results=10000`;

        const response = await fetch(url);
        const data = await response.json();

        // Return ONLY the list so the frontend isn't confused
        res.json(data.response.apps);
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
// NEW: Get Full Game Details by AppID (fixes CORS!)
// -------------------------------
app.get("/steam/appdetails/:appid", async (req, res) => {
    const { appid } = req.params;

    // Check cache (valid for 12 hours)
    if (appDetailsCache.has(appid)) {
        const cached = appDetailsCache.get(appid);
        const age = Date.now() - cached.timestamp;

        if (age < 12 * 60 * 60 * 1000) {
            return res.json(cached.data);
        }
    }

    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`;

    try {
        const response = await fetch(url);
        const json = await response.json();

        if (!json || !json[appid]) {
            return res.status(404).json({ error: "Steam returned no data" });
        }

        // Store in cache
        appDetailsCache.set(appid, {
            timestamp: Date.now(),
            data: json
        });

        res.json(json);

    } catch (err) {
        res.status(500).json({ error: "AppDetails API failed", details: err.message });
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
