"use client"

import { useState } from "react"
import styles from "./filter-dropdown.module.css"

interface FilterDropdownProps {
  value: string
  onChange: (value: string) => void
}

const filterOptions = [
  { value: "all", label: "All Summaries" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "weekly", label: "Weekly" },
  { value: "missed", label: "Missed Messages" },
  { value: "topic-based", label: "Topic Based" },
]

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = filterOptions.find((option) => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={styles.dropdown}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.trigger}>
        <span>{selectedOption?.label || "Select Filter"}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`${styles.option} ${value === option.value ? styles.selected : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
