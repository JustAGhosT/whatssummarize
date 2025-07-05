"use client"

import { useState, useRef, useEffect } from "react"
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
  { value: "missed", label: "Missed" },
  { value: "topic-based", label: "Topic-based" },
]

export function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = filterOptions.find((option) => option.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.triggerText}>{selectedOption?.label || "Select filter"}</span>
        <span className={`${styles.triggerIcon} ${isOpen ? styles.triggerIconOpen : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${option.value === value ? styles.optionSelected : ""}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
