"use client"

import { useState } from "react"
import styles from "./distribution.module.css"

interface DistributionChannel {
  id: string
  type: "email" | "whatsapp" | "slack" | "teams"
  name: string
  config: Record<string, any>
  isEnabled: boolean
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
    config: { channel: "#summaries" },
    isEnabled: false,
  },
  {
    id: "3",
    type: "teams",
    name: "Microsoft Teams",
    config: { channel: "General" },
    isEnabled: true,
  },
]

export function Distribution() {
  const [channels, setChannels] = useState<DistributionChannel[]>(mockChannels)
  const [showAddModal, setShowAddModal] = useState(false)

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) => (channel.id === id ? { ...channel, isEnabled: !channel.isEnabled } : channel)),
    )
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧"
      case "whatsapp":
        return "💬"
      case "slack":
        return "💬"
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
      case "teams":
        return styles.teams
      default:
        return styles.default
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Distribution Channels</h1>
        <p className={styles.subtitle}>Configure where your summaries are delivered</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            Total: <strong>{channels.length}</strong>
          </span>
          <span className={styles.statItem}>
            Active: <strong>{channels.filter((c) => c.isEnabled).length}</strong>
          </span>
        </div>
        <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
          + Add Channel
        </button>
      </div>

      <div className={styles.channelsList}>
        {channels.map((channel) => (
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
            </div>
          </div>
        ))}
      </div>

      {channels.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📤</div>
          <h3 className={styles.emptyTitle}>No distribution channels</h3>
          <p className={styles.emptyText}>Add channels to start receiving your summaries automatically.</p>
        </div>
      )}
    </div>
  )
}
