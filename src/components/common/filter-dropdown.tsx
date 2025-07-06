"use client"

import { useState, useRef, useEffect } from "react"
import type { Platform } from "../../contexts/app-context/types"
import styles from "./filter-dropdown.module.css"

interface FilterDropdownProps {
  selectedPlatform: Platform | "all"
  onPlatformChange: (platform: Platform | "all") => void
  sortBy: "date" | "platform" | "unread"
  onSortChange: (sort: "date" | "platform" | "unread") => void
  className?: string
}

const platforms: Array<{ value: Platform | "all"; label: string; icon: string }> = [
  { value: "all", label: "All Platforms", icon: "🌐" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "slack", label: "Slack", icon: "💼" },
  { value: "discord", label: "Discord", icon: "🎮" },
  { value: "telegram", label: "Telegram", icon: "✈️" },
  { value: "teams", label: "Teams", icon: "👥" },
]

const sortOptions = [
  { value: "date" as const, label: "Date", icon: "📅" },
  { value: "platform" as const, label: "Platform", icon: "🏷️" },
  { value: "unread" as const, label: "Unread", icon: "🔴" },
]

export function FilterDropdown({
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortChange,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const selectedPlatformData = platforms.find((p) => p.value === selectedPlatform)
  const selectedSortData = sortOptions.find((s) => s.value === sortBy)

  return (
    <div className={`${styles.container} ${className || ""}`} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.triggerContent}>
          <span className={styles.triggerIcon}>🔽</span>
          <span className={styles.triggerText}>Filter & Sort</span>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Platform</div>
            <div className={styles.options}>
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  className={`${styles.option} ${selectedPlatform === platform.value ? styles.selected : ""}`}
                  onClick={() => {
                    onPlatformChange(platform.value)
                    setIsOpen(false)
                  }}
                >
                  <span className={styles.optionIcon}>{platform.icon}</span>
                  <span className={styles.optionLabel}>{platform.label}</span>
                  {selectedPlatform === platform.value && <span className={styles.checkmark}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Sort By</div>
            <div className={styles.options}>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.option} ${sortBy === option.value ? styles.selected : ""}`}
                  onClick={() => {
                    onSortChange(option.value)
                    setIsOpen(false)
                  }}
                >
                  <span className={styles.optionIcon}>{option.icon}</span>
                  <span className={styles.optionLabel}>{option.label}</span>
                  {sortBy === option.value && <span className={styles.checkmark}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
