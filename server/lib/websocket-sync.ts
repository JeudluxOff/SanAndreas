import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

/**
 * WebSocket event types for real-time sync
 */
export type SyncEventType =
  | 'case:created'
  | 'case:updated'
  | 'case:deleted'
  | 'document:created'
  | 'document:updated'
  | 'document:deleted'
  | 'client:created'
  | 'client:updated'
  | 'invoice:created'
  | 'invoice:updated'
  | 'sync:full'
  | 'notification:new'
  | 'auth:user-online'
  | 'auth:user-offline';

export interface SyncEvent {
  type: SyncEventType;
  timestamp: string;
  user_id: string;
  data: any;
}

export interface ClientMessage {
  type: string;
  user_id?: string;
  role?: string;
  event?: SyncEventType;
}

/**
 * WebSocket sync manager for real-time updates
 */
export class WebSocketSyncManager {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private userRoles: Map<string, string> = new Map();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: '/api/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('[WS] New client connected');

      ws.on('message', (message: string) => {
        try {
          const data: ClientMessage = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        console.log('[WS] Client disconnected');
        // Clean up client
        for (const [id, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(id);
            this.userRoles.delete(id);
            this.broadcastEvent({
              type: 'auth:user-offline',
              timestamp: new Date().toISOString(),
              user_id: id,
              data: { user_id: id }
            });
            break;
          }
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    console.log('[WS] WebSocket server initialized');
  }

  /**
   * Handle incoming client messages
   */
  private handleClientMessage(ws: WebSocket, message: ClientMessage): void {
    if (message.type === 'auth') {
      // Register authenticated user
      if (message.user_id) {
        this.clients.set(message.user_id, ws);
        if (message.role) {
          this.userRoles.set(message.user_id, message.role);
        }

        ws.send(
          JSON.stringify({
            type: 'auth:success',
            message: 'Authenticated',
            user_id: message.user_id
          })
        );

        // Broadcast user online status
        this.broadcastEvent({
          type: 'auth:user-online',
          timestamp: new Date().toISOString(),
          user_id: message.user_id,
          data: { user_id: message.user_id, role: message.role }
        });

        console.log(`[WS] User ${message.user_id} authenticated`);
      }
    } else if (message.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
    }
  }

  /**
   * Broadcast event to all connected clients
   */
  broadcastEvent(event: SyncEvent): void {
    const message = JSON.stringify(event);

    for (const client of this.clients.values()) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  /**
   * Send event to specific user
   */
  sendToUser(userId: string, event: SyncEvent): void {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  }

  /**
   * Send event to users with specific role
   */
  broadcastToRole(role: string, event: SyncEvent): void {
    for (const [userId, client] of this.clients.entries()) {
      if (this.userRoles.get(userId) === role && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      }
    }
  }

  /**
   * Get connected users count
   */
  getConnectedCount(): number {
    return this.clients.size;
  }

  /**
   * Get list of connected user IDs
   */
  getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }
}

let wsManager: WebSocketSyncManager | null = null;

/**
 * Initialize WebSocket server
 */
export function initializeWebSocket(server: HTTPServer): WebSocketSyncManager {
  if (!wsManager) {
    wsManager = new WebSocketSyncManager(server);
  }
  return wsManager;
}

/**
 * Get WebSocket manager instance
 */
export function getWebSocketManager(): WebSocketSyncManager | null {
  return wsManager;
}
