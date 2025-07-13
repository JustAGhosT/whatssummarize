import { io, Socket } from 'socket.io-client';
import { apiClient } from '../api/client';

type MessageHandler = (message: any) => void;
type EventHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second

  constructor() {
    this.initialize();
  }

  private initialize() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      this.isConnected = false;
      this.handleReconnect();
    });

    this.socket.on('message', (data) => {
      this.notifyMessageHandlers('message', data);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      
      setTimeout(() => {
        this.socket?.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private notifyMessageHandlers(event: string, data: any) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Public methods
  connect() {
    if (!this.socket) {
      this.initialize();
    } else if (!this.isConnected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  onMessage(event: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)?.add(handler);

    // Return cleanup function
    return () => {
      this.messageHandlers.get(event)?.delete(handler);
    };
  }

  onEvent(event: string, handler: EventHandler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
      this.socket?.on(event, (data: any) => {
        this.eventHandlers.get(event)?.forEach(h => h(data));
      });
    }
    this.eventHandlers.get(event)?.add(handler);

    // Return cleanup function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  emit(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      return true;
    }
    return false;
  }

  monitorGroup(groupId: string) {
    return this.emit('monitor_group', { groupId });
  }
}

export const socketService = new SocketService();
