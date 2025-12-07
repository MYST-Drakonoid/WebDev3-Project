import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// Read environment variable safely
const STEAM_KEY = process.env.STEAM_API_KEY;

app.get("/steam/apps", async (req, res) => {
    try {
        const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${STEAM_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Steam API failed", details: err.message });
    }
});

// Health check
app.get("/", (req, res) => {
    res.send("Steam API Proxy Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
