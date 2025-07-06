"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./filter-dropdown.module.css"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface FilterDropdownProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function FilterDropdown({ options, value, onChange, placeholder = "Filter", className }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`${styles.dropdown} ${className || ""}`} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={styles.triggerText}>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.content}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${option.value === value ? styles.selected : ""}`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              type="button"
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {option.count !== undefined && <span className={styles.optionCount}>{option.count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
