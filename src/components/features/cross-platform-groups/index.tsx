"use client"

import { useState } from "react"
import styles from "./cross-platform-groups.module.css"

interface ChatSource {
  id: string
  platform: "whatsapp" | "slack" | "discord" | "telegram" | "teams"
  name: string
  lastRead?: string
  unreadCount: number
  isSelected: boolean
}

interface CrossPlatformGroup {
  id: string
  name: string
  description: string
  chatSources: ChatSource[]
  createdAt: string
  lastSummary?: string
  totalUnread: number
}

const mockChatSources: ChatSource[] = [
  {
    id: "ws1",
    platform: "whatsapp",
    name: "Family Group",
    lastRead: "2024-01-14T10:00:00Z",
    unreadCount: 12,
    isSelected: false,
  },
  {
    id: "sl1",
    platform: "slack",
    name: "Work Team #general",
    lastRead: "2024-01-15T09:30:00Z",
    unreadCount: 8,
    isSelected: false,
  },
  {
    id: "dc1",
    platform: "discord",
    name: "Gaming Community",
    lastRead: "2024-01-15T11:15:00Z",
    unreadCount: 25,
    isSelected: false,
  },
  {
    id: "tg1",
    platform: "telegram",
    name: "Study Group",
    lastRead: "2024-01-14T16:45:00Z",
    unreadCount: 6,
    isSelected: false,
  },
  {
    id: "tm1",
    platform: "teams",
    name: "Project Alpha",
    lastRead: "2024-01-15T08:20:00Z",
    unreadCount: 15,
    isSelected: false,
  },
]

const mockGroups: CrossPlatformGroup[] = [
  {
    id: "g1",
    name: "Work Communications",
    description: "All work-related chats across platforms",
    chatSources: [
      { ...mockChatSources[1], isSelected: true },
      { ...mockChatSources[4], isSelected: true },
    ],
    createdAt: "2024-01-10T12:00:00Z",
    lastSummary: "2024-01-14T18:00:00Z",
    totalUnread: 23,
  },
  {
    id: "g2",
    name: "Personal & Social",
    description: "Family and friends communications",
    chatSources: [
      { ...mockChatSources[0], isSelected: true },
      { ...mockChatSources[2], isSelected: true },
    ],
    createdAt: "2024-01-08T15:30:00Z",
    lastSummary: "2024-01-13T20:00:00Z",
    totalUnread: 37,
  },
]

function CrossPlatformGroups() {
  const [groups, setGroups] = useState<CrossPlatformGroup[]>(mockGroups)
  const [availableSources, setAvailableSources] = useState<ChatSource[]>(mockChatSources)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [selectedSources, setSelectedSources] = useState<string[]>([])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return "💬"
      case "slack":
        return "💼"
      case "discord":
        return "🎮"
      case "telegram":
        return "✈️"
      case "teams":
        return "👥"
      default:
        return "📱"
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return styles.whatsapp
      case "slack":
        return styles.slack
      case "discord":
        return styles.discord
      case "telegram":
        return styles.telegram
      case "teams":
        return styles.teams
      default:
        return styles.default
    }
  }

  const generateGroupSummary = async (groupId: string, type: "weekly" | "since-last-read") => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return

    console.log(`Generating ${type} summary for group: ${group.name}`)

    // Simulate API call and update
    if (type === "since-last-read") {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                totalUnread: 0,
                lastSummary: new Date().toISOString(),
                chatSources: g.chatSources.map((source) => ({
                  ...source,
                  unreadCount: 0,
                  lastRead: new Date().toISOString(),
                })),
              }
            : g,
        ),
      )
    }
  }

  const createGroup = () => {
    if (!newGroupName.trim() || selectedSources.length === 0) return

    const newGroup: CrossPlatformGroup = {
      id: `g${Date.now()}`,
      name: newGroupName,
      description: newGroupDescription,
      chatSources: availableSources.filter((source) => selectedSources.includes(source.id)),
      createdAt: new Date().toISOString(),
      totalUnread: availableSources
        .filter((source) => selectedSources.includes(source.id))
        .reduce((sum, source) => sum + source.unreadCount, 0),
    }

    setGroups((prev) => [...prev, newGroup])
    setShowCreateModal(false)
    setNewGroupName("")
    setNewGroupDescription("")
    setSelectedSources([])
  }

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources((prev) => (prev.includes(sourceId) ? prev.filter((id) => id !== sourceId) : [...prev, sourceId]))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cross-Platform Chat Groups</h1>
        <p className={styles.subtitle}>Group chats from different platforms and get unified summaries</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{groups.length}</div>
            <div className={styles.statLabel}>Groups</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{groups.reduce((sum, group) => sum + group.chatSources.length, 0)}</div>
            <div className={styles.statLabel}>Total Chats</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{groups.reduce((sum, group) => sum + group.totalUnread, 0)}</div>
            <div className={styles.statLabel}>Unread</div>
          </div>
        </div>

        <button onClick={() => setShowCreateModal(true)} className={styles.createBtn}>
          + Create Group
        </button>
      </div>

      <div className={styles.groupsList}>
        {groups.map((group) => (
          <div key={group.id} className={styles.groupCard}>
            <div className={styles.groupHeader}>
              <div className={styles.groupInfo}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <p className={styles.groupDescription}>{group.description}</p>
                <div className={styles.groupMeta}>
                  <span className={styles.metaItem}>{group.chatSources.length} chats</span>
                  {group.totalUnread > 0 && <span className={styles.unreadBadge}>{group.totalUnread} unread</span>}
                  {group.lastSummary && (
                    <span className={styles.metaItem}>
                      Last summary: {new Date(group.lastSummary).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.chatSources}>
              <div className={styles.sourcesLabel}>Connected Chats:</div>
              <div className={styles.sourcesList}>
                {group.chatSources.map((source) => (
                  <div key={source.id} className={styles.sourceItem}>
                    <span className={`${styles.sourceIcon} ${getPlatformColor(source.platform)}`}>
                      {getPlatformIcon(source.platform)}
                    </span>
                    <span className={styles.sourceName}>{source.name}</span>
                    {source.unreadCount > 0 && <span className={styles.sourceUnread}>{source.unreadCount}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.groupActions}>
              <button onClick={() => generateGroupSummary(group.id, "weekly")} className={styles.actionBtn}>
                📊 Weekly Summary
              </button>
              <button
                onClick={() => generateGroupSummary(group.id, "since-last-read")}
                className={styles.actionBtn}
                disabled={group.totalUnread === 0}
              >
                🔄 Since Last Read
                {group.totalUnread > 0 && <span className={styles.actionBadge}>{group.totalUnread}</span>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔗</div>
          <h3 className={styles.emptyTitle}>No Cross-Platform Groups</h3>
          <p className={styles.emptyText}>Create your first group to combine chats from different platforms</p>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create Cross-Platform Group</h2>
              <button onClick={() => setShowCreateModal(false)} className={styles.modalClose}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={styles.formInput}
                  placeholder="e.g., Work Communications"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description (Optional)</label>
                <textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Describe what this group is for..."
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Chats ({selectedSources.length} selected)</label>
                <div className={styles.sourceSelection}>
                  {availableSources.map((source) => (
                    <div
                      key={source.id}
                      className={`${styles.selectableSource} ${
                        selectedSources.includes(source.id) ? styles.selected : ""
                      }`}
                      onClick={() => toggleSourceSelection(source.id)}
                    >
                      <span className={`${styles.sourceIcon} ${getPlatformColor(source.platform)}`}>
                        {getPlatformIcon(source.platform)}
                      </span>
                      <div className={styles.sourceDetails}>
                        <span className={styles.sourceName}>{source.name}</span>
                        <span className={styles.sourcePlatform}>{source.platform.toUpperCase()}</span>
                      </div>
                      {source.unreadCount > 0 && <span className={styles.sourceUnread}>{source.unreadCount}</span>}
                      <div className={styles.checkbox}>{selectedSources.includes(source.id) && "✓"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowCreateModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button
                onClick={createGroup}
                className={styles.createBtn}
                disabled={!newGroupName.trim() || selectedSources.length === 0}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CrossPlatformGroups
