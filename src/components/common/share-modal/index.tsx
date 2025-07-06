"use client"

import type React from "react"

import { useState } from "react"
import styles from "./share-modal.module.css"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onShare: (channels: string[]) => void
  isLoading?: boolean
}

const availableChannels = [
  { id: "email", name: "Email", icon: "📧", description: "Send to your email address" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", description: "Share to WhatsApp contact" },
  { id: "slack", name: "Slack", icon: "💬", description: "Post to Slack channel" },
  { id: "teams", name: "Microsoft Teams", icon: "👥", description: "Share to Teams channel" },
]

export function ShareModal({ isOpen, onClose, onShare, isLoading = false }: ShareModalProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  // Don't render if not open
  if (!isOpen) {
    return null
  }

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    )
  }

  const handleShare = () => {
    if (selectedChannels.length > 0) {
      onShare(selectedChannels)
      // Reset selected channels after sharing
      setSelectedChannels([])
    }
  }

  const handleClose = () => {
    // Reset selected channels when closing
    setSelectedChannels([])
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking the overlay, not the modal content
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Share Summary</h2>
          <button onClick={handleClose} className={styles.closeBtn} type="button" aria-label="Close modal">
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>Choose where you'd like to share this summary:</p>

          <div className={styles.channels}>
            {availableChannels.map((channel) => (
              <label key={channel.id} className={styles.channelOption}>
                <input
                  type="checkbox"
                  checked={selectedChannels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                  className={styles.checkbox}
                  disabled={isLoading}
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
          <button onClick={handleClose} className={styles.cancelBtn} type="button" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={selectedChannels.length === 0 || isLoading}
            className={styles.shareBtn}
            type="button"
          >
            {isLoading
              ? "Sharing..."
              : `Share to ${selectedChannels.length} channel${selectedChannels.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  )
}
