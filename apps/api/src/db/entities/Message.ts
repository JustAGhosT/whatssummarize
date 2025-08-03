import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn, 
  UpdateDateColumn,
  JoinColumn,
  Index
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Group } from './Group.js';
import { User } from './User.js';

export interface MessageMetadata {
  whatsappMessageId?: string;
  forwarded?: boolean;
  replyToMessageId?: string;
  reactions?: Record<string, string>; // userId -> reaction
  edited?: boolean;
  deleted?: boolean;
  readBy?: string[]; // user IDs who have read the message
}

@Entity({ name: 'messages' })
@Index(['groupId', 'createdAt']) // For faster message retrieval by group
@Index(['senderId']) // For faster message lookup by sender
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  senderName: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'senderId' })
  sender: Relation<User>;

  @Column({ nullable: true })
  senderId?: string;

  @Column({ default: false })
  isMedia: boolean;

  @Column({ nullable: true })
  mediaUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: MessageMetadata;

  @ManyToOne(() => Group, group => group.messages, { 
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'groupId' })
  group: Relation<Group>;

  @Column({ type: 'uuid' })
  groupId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
