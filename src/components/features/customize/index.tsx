"use client"

import { useState } from "react"
import { useAppContext } from "../../../contexts/app-context"
import styles from "./customize.module.css"

export function CustomizeView() {
  const { state, dispatch } = useAppContext()
  const [preferences, setPreferences] = useState(state.preferences)
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
    if (newKeyword.trim()) {
      setPreferences((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    setPreferences((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }))
  }

  const savePreferences = () => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: preferences })
    // Show success message
  }

  return (
    <div className={styles.customize}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Current Preferences */}
          <div className={styles.section}>
            <div className="card" style={{ padding: "24px" }}>
              <div className={styles.sectionHeader}>
                <h2>Current Preferences</h2>
                <button className="btn-secondary">🔄 Refresh</button>
              </div>
              <div className={styles.currentPrefs}>
                <p>Your current settings are displayed here</p>
              </div>
            </div>
          </div>

          {/* Customize Preferences */}
          <div className={styles.section}>
            <div className="card" style={{ padding: "24px" }}>
              <h2 className={styles.sectionTitle}>Customize Preferences</h2>

              {/* Summary Types */}
              <div className={styles.formGroup}>
                <h3>Summary Types</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={preferences.summaryTypes.weeklyDigest}
                      onChange={() => handleSummaryTypeChange("weeklyDigest")}
                    />
                    <span>Weekly digest</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={preferences.summaryTypes.missedMessages}
                      onChange={() => handleSummaryTypeChange("missedMessages")}
                    />
                    <span>Missed message catch-up</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={preferences.summaryTypes.topicBased}
                      onChange={() => handleSummaryTypeChange("topicBased")}
                    />
                    <span>Topic-based filter</span>
                  </label>
                </div>
              </div>

              {/* Schedule Settings */}
              <div className={styles.formGroup}>
                <h3>Schedule Settings</h3>
                <div className={styles.scheduleGrid}>
                  <div>
                    <label>Frequency</label>
                    <select
                      className="select-field"
                      value={preferences.schedule.frequency}
                      onChange={(e) => handleScheduleChange("frequency", e.target.value)}
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label>Time</label>
                    <input
                      type="time"
                      className="input-field"
                      value={preferences.schedule.time}
                      onChange={(e) => handleScheduleChange("time", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Topic Keywords */}
              <div className={styles.formGroup}>
                <h3>Topic Keywords</h3>
                <p className={styles.fieldDescription}>Keywords for topic-based filtering</p>
                <div className={styles.keywordInput}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Add keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                  />
                  <button className="btn-primary" onClick={addKeyword}>
                    Add
                  </button>
                </div>
                <div className={styles.keywords}>
                  {preferences.keywords.map((keyword, index) => (
                    <span key={index} className={styles.keyword}>
                      {keyword}
                      <button onClick={() => removeKeyword(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={savePreferences}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Add Automated Schedule */}
        <div className="card" style={{ padding: "24px", marginTop: "24px" }}>
          <h2 className={styles.sectionTitle}>Add Automated Schedule</h2>
          <div className={styles.scheduleForm}>
            <div className={styles.scheduleGrid}>
              <div>
                <label>Summary Type</label>
                <select className="select-field">
                  <option value="">Select summary type</option>
                  <option value="weekly">Weekly Digest</option>
                  <option value="missed">Missed Messages</option>
                  <option value="topic-based">Topic-Based</option>
                </select>
              </div>
              <div>
                <label>Frequency</label>
                <select className="select-field">
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label>Time</label>
                <input type="time" className="input-field" />
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop: "16px" }}>
              Add Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
