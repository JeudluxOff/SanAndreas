import path from "path";
import { createServer } from "./index";
import { initializeWebSocket } from "./lib/websocket-sync";
import * as express from "express";
import { createServer as createHTTPServer } from "http";

const app = createServer();
const port = process.env.PORT || 3000;

// Create HTTP server for WebSocket support
const httpServer = createHTTPServer(app);

// Initialize WebSocket server
initializeWebSocket(httpServer);

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health") || req.path.startsWith("/ws")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

httpServer.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🔄 WebSocket: ws://localhost:${port}/api/ws`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
