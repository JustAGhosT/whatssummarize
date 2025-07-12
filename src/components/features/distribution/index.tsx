"use client"

import { useState } from "react"
import styles from "./distribution.module.css"

interface DistributionChannel {
  id: string
  type: "email" | "whatsapp" | "slack" | "discord" | "telegram" | "teams"
  name: string
  config: Record<string, any>
  isEnabled: boolean
  platform?: string
  lastRead?: string
  unreadCount?: number
}

const mockChannels: DistributionChannel[] = [
  {
    id: "1",
    type: "email",
    name: "Personal Email",
    config: { email: "john@example.com" },
    isEnabled: true,
  },
  {
    id: "2",
    type: "slack",
    name: "Work Slack",
    config: { workspace: "company-workspace", channel: "#summaries" },
    isEnabled: false,
    platform: "Slack",
    lastRead: "2024-01-15T10:30:00Z",
    unreadCount: 12,
  },
  {
    id: "3",
    type: "teams",
    name: "Microsoft Teams",
    config: { team: "Development Team", channel: "General" },
    isEnabled: true,
    platform: "Teams",
    lastRead: "2024-01-14T16:45:00Z",
    unreadCount: 8,
  },
  {
    id: "4",
    type: "discord",
    name: "Gaming Discord",
    config: { server: "Gaming Community", channel: "#general" },
    isEnabled: true,
    platform: "Discord",
    lastRead: "2024-01-15T09:15:00Z",
    unreadCount: 25,
  },
  {
    id: "5",
    type: "telegram",
    name: "Family Telegram",
    config: { chat: "Family Group" },
    isEnabled: true,
    platform: "Telegram",
    lastRead: "2024-01-15T12:00:00Z",
    unreadCount: 5,
  },
  {
    id: "6",
    type: "whatsapp",
    name: "WhatsApp Business",
    config: { number: "+1234567890" },
    isEnabled: true,
    platform: "WhatsApp",
    lastRead: "2024-01-15T11:30:00Z",
    unreadCount: 18,
  },
]

function Distribution() {
  const [channels, setChannels] = useState<DistributionChannel[]>(mockChannels)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [summaryType, setSummaryType] = useState<"weekly" | "since-last-read">("weekly")

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === id ? { ...channel, isEnabled: !channel.isEnabled } : channel)),
    )
  }

  const generateSummary = async (channelId: string, type: "weekly" | "since-last-read") => {
    const channel = channels.find((c) => c.id === channelId)
    if (!channel) return

    // Simulate API call
    console.log(`Generating ${type} summary for ${channel.name} (${channel.type})`)

    // Update last read time if generating since-last-read summary
    if (type === "since-last-read") {
      setChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, lastRead: new Date().toISOString(), unreadCount: 0 } : c)),
      )
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧"
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
        return "📤"
    }
  }

  const getChannelColor = (type: string) => {
    switch (type) {
      case "email":
        return styles.email
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

  const getPlatformChannels = () => {
    if (selectedPlatform === "all") return channels
    return channels.filter(
      (channel) => channel.type === selectedPlatform || channel.platform?.toLowerCase() === selectedPlatform,
    )
  }

  const platforms = ["all", "whatsapp", "slack", "discord", "telegram", "teams", "email"]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Multi-Platform Chat Management</h1>
        <p className={styles.subtitle}>Manage summaries across all your messaging platforms</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.filterSection}>
          <div className={styles.platformFilter}>
            <label htmlFor="platform-select" className={styles.filterLabel}>Platform:</label>
            <select
              id="platform-select"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className={styles.filterSelect}
              aria-label="Select platform to filter by"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform === "all" ? "All Platforms" : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.summaryTypeFilter}>
            <label className={styles.filterLabel}>Summary Type:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="weekly"
                  checked={summaryType === "weekly"}
                  onChange={(e) => setSummaryType(e.target.value as "weekly")}
                />
                Weekly
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="since-last-read"
                  checked={summaryType === "since-last-read"}
                  onChange={(e) => setSummaryType(e.target.value as "since-last-read")}
                />
                Since Last Read
              </label>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{getPlatformChannels().length}</strong>
          </span>
          <span className={styles.statItem}>
            Active: <strong>{getPlatformChannels().filter((c) => c.isEnabled).length}</strong>
          </span>
          <span className={styles.statItem}>
            Unread: <strong>{getPlatformChannels().reduce((sum, c) => sum + (c.unreadCount || 0), 0)}</strong>
          </span>
        </div>

        <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
          + Add Platform
        </button>
      </div>

      <div className={styles.channelsList}>
        {getPlatformChannels().map((channel) => (
          <div key={channel.id} className={`${styles.channelCard} ${!channel.isEnabled ? styles.disabled : ""}`}>
            <div className={styles.channelHeader}>
              <div className={styles.channelInfo}>
                <div className={styles.channelIcon}>
                  <span className={`${styles.icon} ${getChannelColor(channel.type)}`}>
                    {getChannelIcon(channel.type)}
                  </span>
                  <div>
                    <h3 className={styles.channelName}>{channel.name}</h3>
                    <p className={styles.channelType}>{channel.type.toUpperCase()}</p>
                    {channel.unreadCount && channel.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>{channel.unreadCount} unread</span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.channelActions}>
                <button
                  onClick={() => toggleChannel(channel.id)}
                  className={`${styles.toggleBtn} ${channel.isEnabled ? styles.enabled : styles.disabled}`}
                >
                  {channel.isEnabled ? "Enabled" : "Disabled"}
                </button>
                <button className={styles.configBtn}>⚙️</button>
              </div>
            </div>

            <div className={styles.channelConfig}>
              {Object.entries(channel.config).map(([key, value]) => (
                <div key={key} className={styles.configItem}>
                  <span className={styles.configKey}>{key}:</span>
                  <span className={styles.configValue}>{value}</span>
                </div>
              ))}
              {channel.lastRead && (
                <div className={styles.configItem}>
                  <span className={styles.configKey}>Last Read:</span>
                  <span className={styles.configValue}>{new Date(channel.lastRead).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className={styles.summaryActions}>
              <button
                onClick={() => generateSummary(channel.id, "weekly")}
                className={styles.summaryBtn}
                disabled={!channel.isEnabled}
              >
                📊 Weekly Summary
              </button>
              <button
                onClick={() => generateSummary(channel.id, "since-last-read")}
                className={styles.summaryBtn}
                disabled={!channel.isEnabled || !channel.unreadCount}
              >
                🔄 Since Last Read
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <span className={styles.actionBadge}>{channel.unreadCount}</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {getPlatformChannels().length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📤</div>
          <h3 className={styles.emptyTitle}>No channels found</h3>
          <p className={styles.emptyText}>
            {selectedPlatform === "all"
              ? "Add channels to start receiving your summaries automatically."
              : `No ${selectedPlatform} channels configured.`}
          </p>
        </div>
      )}
    </div>
  )
}

export default Distribution
