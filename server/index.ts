import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { handleDemo } from "./routes/demo";
import { handlePublish, handleGetPublishHistory } from "./routes/admin";
import { cloudStorage } from "./lib/s3-storage";
import { authRouter } from "./routes/api-v2-auth";
import { casesRouter } from "./routes/api-v2-cases";
import { auditRouter } from "./routes/api-v2-audit";
import { errorHandler } from "./middleware/auth";

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

  // File upload endpoint (base64 / local storage)
  app.post("/api/files", (req, res) => {
    try {
      const { filename, content, type } = req.body;

      if (!filename || !content) {
        return res.status(400).json({ error: "Missing filename or content" });
      }

      // Decode base64 content
      const buffer = Buffer.from(content, 'base64');

      cloudStorage.uploadFile(filename, buffer, {
        contentType: type || 'application/octet-stream'
      }).then(file => {
        res.json(file);
      }).catch(error => {
        res.status(500).json({ error: "File upload failed", details: error.message });
      });
    } catch (error) {
      res.status(500).json({ error: "File upload failed" });
    }
  });

  // Cloud storage upload endpoint (FormData / multipart)
  app.post("/api/files/upload-cloud", (req, res) => {
    try {
      // This would handle multipart/form-data in production
      // For now, return an error directing users to use the base64 endpoint
      res.status(400).json({
        error: "Cloud upload not configured",
        message: "Please configure AWS S3 credentials in environment variables"
      });
    } catch (error) {
      res.status(500).json({ error: "Cloud upload failed" });
    }
  });

  // Get file metadata
  app.get("/api/files", (_req, res) => {
    try {
      const files = cloudStorage.listFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to list files" });
    }
  });

  // File retrieval endpoint
  app.get("/api/files/:fileId", (req, res) => {
    try {
      const { fileId } = req.params;
      const file = cloudStorage.getFileMetadata(fileId);

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json(file);
    } catch (error) {
      res.status(500).json({ error: "File retrieval failed" });
    }
  });

  // Get presigned URL for file
  app.get("/api/files/:fileId/presigned", (req, res) => {
    try {
      const { fileId } = req.params;
      const expires = parseInt(req.query.expires as string) || 3600;

      cloudStorage.getPresignedUrl(fileId, expires).then(presigned_url => {
        res.json({ presigned_url });
      }).catch(error => {
        res.status(404).json({ error: error.message });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  });

  // Delete file
  app.delete("/api/files/:fileId", (req, res) => {
    try {
      const { fileId } = req.params;

      cloudStorage.deleteFile(fileId).then(() => {
        res.json({ message: "File deleted successfully" });
      }).catch(error => {
        res.status(404).json({ error: error.message });
      });
    } catch (error) {
      res.status(500).json({ error: "File deletion failed" });
    }
  });

  // Admin Routes
  app.post("/api/admin/publish", handlePublish);
  app.get("/api/admin/publish-history", handleGetPublishHistory);

  // API v2 Routes with Authentication
  app.use("/api/v2/auth", authRouter);
  app.use("/api/v2/cases", casesRouter);
  app.use("/api/v2/audit", auditRouter);

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
