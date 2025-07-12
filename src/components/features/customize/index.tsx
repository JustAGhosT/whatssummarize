"use client"

import { useState } from "react"
import styles from "./customize.module.css"

function Customize() {
  const [preferences, setPreferences] = useState({
    summaryTypes: {
      weeklyDigest: true,
      missedMessages: true,
      topicBased: false,
    },
    schedule: {
      frequency: "weekly" as "daily" | "weekly" | "monthly",
      time: "09:00",
    },
    keywords: ["work", "family", "urgent"],
  })

  const [newKeyword, setNewKeyword] = useState("")

  const handleSummaryTypeChange = (type: keyof typeof preferences.summaryTypes) => {
    setPreferences((prev) => ({
      ...prev,
      summaryTypes: {
        ...prev.summaryTypes,
        [type]: !prev.summaryTypes[type],
      },
    }))
  }

  const handleScheduleChange = (field: keyof typeof preferences.schedule, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value,
      },
    }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !preferences.keywords.includes(newKeyword.trim())) {
      setPreferences((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setPreferences((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customize Settings</h1>
        <p className={styles.subtitle}>Configure your summary preferences and schedule</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary Types</h2>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.summaryTypes.weeklyDigest}
                onChange={() => handleSummaryTypeChange("weeklyDigest")}
              />
              <span>Weekly Digest</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.summaryTypes.missedMessages}
                onChange={() => handleSummaryTypeChange("missedMessages")}
              />
              <span>Missed Messages</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.summaryTypes.topicBased}
                onChange={() => handleSummaryTypeChange("topicBased")}
              />
              <span>Topic-Based Summaries</span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Schedule</h2>
          <div className={styles.scheduleGroup}>
            <div className={styles.field}>
              <label htmlFor="frequency" className={styles.label}>Frequency</label>
              <select
                id="frequency"
                value={preferences.schedule.frequency}
                onChange={(e) => handleScheduleChange("frequency", e.target.value)}
                className={styles.select}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="schedule-time" className={styles.label}>Time</label>
              <input
                id="schedule-time"
                type="time"
                value={preferences.schedule.time}
                onChange={(e) => handleScheduleChange("time", e.target.value)}
                className={styles.input}
                aria-label="Select time for summary"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Keywords</h2>
          <div className={styles.keywordGroup}>
            <div className={styles.keywordInput}>
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword..."
                className={styles.input}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                aria-label="Enter keyword to add"
              />
              <button 
                onClick={addKeyword} 
                className={styles.addBtn}
                aria-label="Add keyword"
              >
                Add
              </button>
            </div>
            <div className={styles.keywords}>
              {preferences.keywords.map((keyword) => (
                <span key={keyword} className={styles.keyword}>
                  {keyword}
                  <button 
                    onClick={() => removeKeyword(keyword)} 
                    className={styles.removeBtn}
                    aria-label={`Remove keyword ${keyword}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.saveBtn}>Save Settings</button>
          <button className={styles.resetBtn}>Reset to Default</button>
        </div>
      </div>
    </div>
  )
}

export default Customize
