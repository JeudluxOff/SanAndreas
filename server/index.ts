import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { handleDemo } from "./routes/demo";

const SHARED_LOCATIONS_PATH = path.resolve(process.cwd(), "shared", "locations.json");

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Map locations persistence
  app.get("/api/map", (_req, res) => {
    try {
      if (fs.existsSync(SHARED_LOCATIONS_PATH)) {
        const data = fs.readFileSync(SHARED_LOCATIONS_PATH, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.status(404).json({ error: "Locations not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/map", (req, res) => {
    try {
      const locations = req.body;
      if (!Array.isArray(locations)) {
        return res.status(400).json({ error: "Invalid locations data" });
      }
      fs.writeFileSync(SHARED_LOCATIONS_PATH, JSON.stringify(locations, null, 2));
      res.json({ message: "Locations saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}
