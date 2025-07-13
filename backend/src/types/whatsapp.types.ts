import { Server as SocketIOServer } from 'socket.io';

export interface WhatsAppMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isMedia: boolean;
  mediaUrl?: string;
}

export interface WhatsAppClient {
  initialize(): Promise<void>;
  monitorGroup(groupName: string): Promise<void>;
  cleanup(): Promise<void>;
  on(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

export type CreateWhatsAppClient = (io: SocketIOServer) => WhatsAppClient;
