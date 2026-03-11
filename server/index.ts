import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { handleDemo } from "./routes/demo";
import { handlePublish, handleGetPublishHistory } from "./routes/admin";

const SHARED_LOCATIONS_PATH = path.resolve(process.cwd(), "shared", "locations.json");
const SHARED_LEGAL_PATH = path.resolve(process.cwd(), "shared", "legal-data.json");
const SHARED_GOVERNMENT_PATH = path.resolve(process.cwd(), "shared", "government-data.json");

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

  // Legal Data persistence
  app.get("/api/legal", (_req, res) => {
    try {
      if (fs.existsSync(SHARED_LEGAL_PATH)) {
        const data = fs.readFileSync(SHARED_LEGAL_PATH, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.status(404).json({ error: "Legal data not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/legal", (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(SHARED_LEGAL_PATH, JSON.stringify(data, null, 2));
      res.json({ message: "Legal data saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Government Data persistence
  app.get("/api/government", (_req, res) => {
    try {
      if (fs.existsSync(SHARED_GOVERNMENT_PATH)) {
        const data = fs.readFileSync(SHARED_GOVERNMENT_PATH, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.status(404).json({ error: "Government data not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/government", (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(SHARED_GOVERNMENT_PATH, JSON.stringify(data, null, 2));
      res.json({ message: "Government data saved successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

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

  // File upload endpoint
  app.post("/api/files", (req, res) => {
    try {
      const { filename, content, type } = req.body;

      if (!filename || !content) {
        return res.status(400).json({ error: "Missing filename or content" });
      }

      // Generate a unique file ID
      const fileId = `FILE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // In a production app, you'd save to disk or cloud storage
      // For now, we'll generate a data URL or placeholder that includes the file info
      const file_url = `/api/files/${fileId}`;

      res.json({
        file_id: fileId,
        file_url,
        filename,
        uploaded_at: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "File upload failed" });
    }
  });

  // File retrieval endpoint (placeholder)
  app.get("/api/files/:fileId", (req, res) => {
    try {
      const { fileId } = req.params;
      // In production, retrieve file from storage
      // For now, return a placeholder
      res.json({
        file_id: fileId,
        message: "File retrieval endpoint"
      });
    } catch (error) {
      res.status(500).json({ error: "File retrieval failed" });
    }
  });

  // Admin Routes
  app.post("/api/admin/publish", handlePublish);
  app.get("/api/admin/publish-history", handleGetPublishHistory);

  return app;
}
