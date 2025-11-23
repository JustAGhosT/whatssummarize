import * as io from 'socket.io-client';
import { apiClient } from '../api/client';

type MessageHandler = (message: unknown) => void;
type EventHandler = (data: unknown) => void;

interface SocketError {
  message: string;
  code?: string | number;
  data?: unknown;
}

type CustomSocket = SocketIOClient.Socket & {
  reconnect: () => CustomSocket;
};

class SocketService {
  private socket: CustomSocket | null = null;
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
    // SECURITY HOTSPOT: localStorage is vulnerable to XSS attacks
    // TODO: Migrate to Supabase Auth which uses secure httpOnly cookies
    const token = localStorage.getItem('authToken');
    if (!token) return;

    this.initializeSocket();
  }

  private initializeSocket() {
    // SECURITY HOTSPOT: localStorage is vulnerable to XSS attacks  
    // TODO: Migrate to Supabase Auth which uses secure httpOnly cookies
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const socket = (io as any).connect(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      query: { token },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.socket = socket as unknown as CustomSocket;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('message', this.handleMessage);
    this.socket.on('error', this.handleError);
  }

  private handleConnect = () => {
    console.log('Connected to WebSocket server');
    this.isConnected = true;
    this.reconnectAttempts = 0;
  }

  private handleDisconnect = (reason: string) => {
    console.log('Disconnected from WebSocket server:', reason);
    this.isConnected = false;
    this.handleReconnect();
  }

  private handleMessage = (data: unknown) => {
    this.notifyMessageHandlers('message', data);
  }

  private handleError = (error: SocketError) => {
    console.error('WebSocket error:', error);
  }

  private handleReconnect = () => {
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
  public connect() {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.initializeSocket();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public onMessage(event: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)?.add(handler);

    // Return cleanup function
    return () => {
      this.messageHandlers.get(event)?.delete(handler);
    };
  }

  public onEvent(event: string, handler: EventHandler) {
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

  public sendMessage(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public monitorGroup(groupId: string) {
    return this.sendMessage('monitor_group', { groupId });
  }
}

export const socketService = new SocketService();
