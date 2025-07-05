"use client"

import { useState } from "react"
import { useAppContext } from "../../../contexts/app-context"
import { Modal } from "../../common/modal"
import styles from "./distribution.module.css"

export function DistributionView() {
  const { state, dispatch } = useAppContext()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newChannel, setNewChannel] = useState({
    type: "",
    name: "",
    config: {},
    isEnabled: true,
  })

  const distributionStats = {
    totalSent: 247,
    lastSent: "2 hours ago",
    successRate: "96.7%",
  }

  const handleAddChannel = () => {
    if (newChannel.type && newChannel.name) {
      const channel = {
        id: Date.now().toString(),
        ...newChannel,
        createdAt: new Date().toISOString(),
      }
      dispatch({ type: "ADD_DISTRIBUTION_CHANNEL", payload: channel })
      setShowAddModal(false)
      setNewChannel({ type: "", name: "", config: {}, isEnabled: true })
    }
  }

  return (
    <div className={styles.distribution}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Distribution Settings</h1>
            <p className={styles.subtitle}>
              Configure how and where your summaries are distributed to reach your audience effectively.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <div className={styles.sectionHeader}>
            <h2>Current Distribution Channels</h2>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              + Add Channel
            </button>
          </div>

          <div className={styles.emptyChannels}>
            <p>No distribution channels configured yet.</p>
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <h2 className={styles.sectionTitle}>Distribution Statistics</h2>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📤</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Total Sent</div>
                <div className={styles.statValue}>{distributionStats.totalSent}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🕐</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Last Sent</div>
                <div className={styles.statValue}>{distributionStats.lastSent}</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>Success Rate</div>
                <div className={styles.statValue}>{distributionStats.successRate}</div>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Distribution Channel">
          <div className={styles.modalContent}>
            <div className={styles.formGroup}>
              <label>Channel Type</label>
              <select
                className="select-field"
                value={newChannel.type}
                onChange={(e) => setNewChannel((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value="">Select a channel type</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="slack">Slack</option>
                <option value="teams">Microsoft Teams</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Channel Configuration</label>
              <textarea className="input-field" placeholder="Enter channel configuration details..." rows={4} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={newChannel.isEnabled}
                  onChange={(e) => setNewChannel((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                />
                <span>Enable this channel</span>
              </label>
            </div>

            <div className={styles.modalActions}>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddChannel}>
                Save Channel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
