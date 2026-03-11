/**
 * WebSocket client for real-time synchronization
 * Replaces polling with event-driven updates
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

export type SyncEventHandler = (event: SyncEvent) => void;

/**
 * WebSocket sync client for real-time data updates
 */
export class WebSocketSyncClient {
  private ws: WebSocket | null = null;
  private url: string;
  private userId: string | null = null;
  private role: string | null = null;
  private listeners: Map<SyncEventType | 'all', Set<SyncEventHandler>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 3000;
  private isAuthenticated: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = `${protocol}//${window.location.host}/api/ws`;
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId: string, role?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.role = role || 'guest';

        if (this.ws) {
          this.ws.close();
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('[WS] Connected to server');
          this.reconnectAttempts = 0;

          // Authenticate with server
          this.send({
            type: 'auth',
            user_id: this.userId,
            role: this.role
          });

          // Start heartbeat
          this.startHeartbeat();

          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const data: any = JSON.parse(event.data);

            if (data.type === 'auth:success') {
              this.isAuthenticated = true;
              console.log('[WS] Authentication successful');
            } else if (data.type === 'pong') {
              // Heartbeat response
              console.log('[WS] Heartbeat received');
            } else {
              // Emit event to listeners
              this.emit(data.type as SyncEventType, data);
            }
          } catch (error) {
            console.error('[WS] Message parse error:', error);
          }
        };

        this.ws.onerror = (error: Event) => {
          console.error('[WS] Connection error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[WS] Connection closed');
          this.isAuthenticated = false;
          this.stopHeartbeat();

          // Attempt to reconnect
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(
              `[WS] Reconnecting (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
            );
            setTimeout(() => this.connect(userId, role), this.reconnectDelay);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isAuthenticated = false;
  }

  /**
   * Send message to server
   */
  private send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Subscribe to specific event type
   */
  on(eventType: SyncEventType | 'all', handler: SyncEventHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  /**
   * Unsubscribe from specific event type
   */
  off(eventType: SyncEventType | 'all', handler: SyncEventHandler): void {
    this.listeners.get(eventType)?.delete(handler);
  }

  /**
   * Emit event to listeners
   */
  private emit(eventType: SyncEventType, event: SyncEvent): void {
    // Call type-specific listeners
    const typeListeners = this.listeners.get(eventType);
    if (typeListeners) {
      typeListeners.forEach((handler) => handler(event));
    }

    // Call wildcard listeners
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      allListeners.forEach((handler) => handler(event));
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isAuthenticated) {
        this.send({ type: 'ping' });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.isAuthenticated && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Force reconnect
   */
  reconnect(): Promise<void> {
    if (this.userId && this.role) {
      return this.connect(this.userId, this.role);
    }
    return Promise.reject(new Error('Cannot reconnect: userId not set'));
  }
}

// Export singleton instance
let syncClient: WebSocketSyncClient | null = null;

export function getSyncClient(): WebSocketSyncClient {
  if (!syncClient) {
    syncClient = new WebSocketSyncClient();
  }
  return syncClient;
}

export function initializeSync(userId: string, role?: string): Promise<void> {
  const client = getSyncClient();
  return client.connect(userId, role);
}

export function disconnectSync(): void {
  getSyncClient().disconnect();
}
