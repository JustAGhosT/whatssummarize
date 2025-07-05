"use client"

import { useState } from "react"
import { useAppContext } from "../../../contexts/app-context"
import styles from "./notifications.module.css"

export function NotificationsView() {
  const { state, dispatch } = useAppContext()
  const [showAddForm, setShowAddForm] = useState(false)

  const notificationTypes = [
    {
      id: "summary-ready",
      title: "Summary Ready",
      description: "Get notified when your AI-generated summaries are ready to view",
      icon: "✅",
    },
    {
      id: "while-away",
      title: "While You Were Away",
      description: "Catch up on messages you missed while offline",
      icon: "🕐",
    },
    {
      id: "scheduled-digest",
      title: "Scheduled Digest",
      description: "Regular summaries delivered on your preferred schedule",
      icon: "📅",
    },
  ]

  return (
    <div className={styles.notifications}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Notification Settings</h1>
            <p className={styles.subtitle}>Configure when and how you receive notifications from WhatsSummarize</p>
          </div>
        </div>

        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <div className={styles.sectionHeader}>
            <h2>Active Notifications</h2>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              + Add New Notification
            </button>
          </div>

          <div className={styles.emptyState}>
            <p>No active notifications configured.</p>
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <h2 className={styles.sectionTitle}>Notification Types</h2>

          <div className={styles.notificationTypes}>
            {notificationTypes.map((type) => (
              <div key={type.id} className={styles.notificationType}>
                <div className={styles.typeIcon}>{type.icon}</div>
                <div className={styles.typeContent}>
                  <h3 className={styles.typeTitle}>{type.title}</h3>
                  <p className={styles.typeDescription}>{type.description}</p>
                </div>
                <div className={styles.typeActions}>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <h3>WhatsSummarize</h3>
              <p>Streamline your WhatsApp group communication with intelligent automation and AI-powered summaries.</p>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.linkGroup}>
                <h4>Product</h4>
                <ul>
                  <li>
                    <a href="/dashboard">Dashboard</a>
                  </li>
                  <li>
                    <a href="/groups">Connect Groups</a>
                  </li>
                  <li>
                    <a href="/customize">Customize</a>
                  </li>
                </ul>
              </div>

              <div className={styles.linkGroup}>
                <h4>Settings</h4>
                <ul>
                  <li>
                    <a href="/distribution">Distribution</a>
                  </li>
                  <li>
                    <a href="/notifications">Notifications</a>
                  </li>
                  <li>
                    <a href="/admin">Admin Controls</a>
                  </li>
                </ul>
              </div>

              <div className={styles.linkGroup}>
                <h4>Support</h4>
                <ul>
                  <li>
                    <a href="/help">Help Center</a>
                  </li>
                  <li>
                    <a href="/contact">Contact Us</a>
                  </li>
                  <li>
                    <a href="/privacy">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
