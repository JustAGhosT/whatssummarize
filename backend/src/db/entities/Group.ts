import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  Index
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Message } from './Message.js';
import { User } from './User.js';

export interface GroupMetadata {
  whatsappGroupId?: string;
  createdBy?: string; // User ID
  lastActivity?: Date;
  participantCount?: number;
  adminIds?: string[];
  customSettings?: Record<string, unknown>;
}

@Entity({ name: 'groups' })
@Index(['name'], { unique: true })
@Index(['isActive', 'isArchived'])
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  slug?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 7, default: '#3b82f6' })
  color: string = '#3b82f6'; // Default blue color

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @ManyToOne(() => User, user => user.ownedGroups, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  ownerId?: string;

  @ManyToMany(() => User, user => user.groups)
  @JoinTable({
    name: 'group_members',
    joinColumn: { name: 'groupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId' }
  })
  members: Relation<User[]>;

  @OneToMany(() => Message, message => message.group, { cascade: true })
  messages: Relation<Message[]>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: GroupMetadata;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt?: Date;
}
