"use client"

import styles from "./filter-dropdown.module.css"

interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
}

export function FilterDropdown({ value, onChange, options }: FilterDropdownProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
