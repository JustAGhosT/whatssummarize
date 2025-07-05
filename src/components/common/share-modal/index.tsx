"use client"

import { useState } from "react"
import styles from "./share-modal.module.css"

interface ShareModalProps {
  onClose: () => void
  onShare: (channels: string[]) => void
  loading?: boolean
}

const availableChannels = [
  { id: "email", name: "Email", icon: "📧", description: "Send to your email address" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", description: "Share to WhatsApp contact" },
  { id: "slack", name: "Slack", icon: "💬", description: "Post to Slack channel" },
  { id: "teams", name: "Microsoft Teams", icon: "👥", description: "Share to Teams channel" },
]

export function ShareModal({ onClose, onShare, loading = false }: ShareModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    )
  }

  const handleShare = () => {
    if (selectedChannels.length > 0) {
      onShare(selectedChannels)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Share Personal Summary</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>Choose where you'd like to share your personal summary:</p>

          <div className={styles.channels}>
            {availableChannels.map((channel) => (
              <label key={channel.id} className={styles.channelOption}>
                <input
                  type="checkbox"
                  checked={selectedChannels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                  className={styles.checkbox}
                />
                <div className={styles.channelInfo}>
                  <div className={styles.channelHeader}>
                    <span className={styles.channelIcon}>{channel.icon}</span>
                    <span className={styles.channelName}>{channel.name}</span>
                  </div>
                  <span className={styles.channelDescription}>{channel.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleShare} disabled={selectedChannels.length === 0 || loading} className={styles.shareBtn}>
            {loading
              ? "Sharing..."
              : `Share to ${selectedChannels.length} channel${selectedChannels.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  )
}
