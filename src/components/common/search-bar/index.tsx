"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import styles from "./search-bar.module.css"

interface SearchResult {
  id: string
  type: "group" | "summary" | "platform"
  title: string
  subtitle?: string
  icon: string
  url: string
}

interface SearchBarProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  isMobile?: boolean
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "group",
    title: "Family Group",
    subtitle: "WhatsApp • 12 unread",
    icon: "👨‍👩‍👧‍👦",
    url: "/groups/family",
  },
  {
    id: "2",
    type: "summary",
    title: "Weekly Summary - Jan 8-14",
    subtitle: "Personal Summary",
    icon: "📊",
    url: "/personal/summary/1",
  },
  {
    id: "3",
    type: "platform",
    title: "Slack Integration",
    subtitle: "Work Team #general",
    icon: "💼",
    url: "/distribution/slack",
  },
  {
    id: "4",
    type: "group",
    title: "Work Communications",
    subtitle: "Cross-platform group • 23 unread",
    icon: "💼",
    url: "/cross-platform-groups/work",
  },
]

export function SearchBar({ isOpen, onToggle, onClose, isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const hasResults = results.length > 0
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
    setSelectedIndex(-1)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = selectedIndex < results.length - 1 ? selectedIndex + 1 : 0
        setSelectedIndex(nextIndex)
        break
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : results.length - 1
        setSelectedIndex(prevIndex)
        break
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault()
          window.location.href = results[selectedIndex].url
          onClose()
        }
        break
      case 'Home':
        e.preventDefault()
        setSelectedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setSelectedIndex(results.length - 1)
        break
      default:
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    window.location.href = result.url
    onClose()
  }



  if (isMobile) {
    return (
      <div className={styles.mobileSearch}>
        <div className={styles.mobileSearchInput}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            role="img"
            aria-label="Search"
          >
            <title>Search</title>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <label htmlFor="chat-search" className="sr-only">
  Search chats and summaries
          </label>

          <input
            id="chat-search"
            ref={inputRef}
            type="text"
            placeholder="Search chats, summaries…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={hasResults ? "true" : "false"}
            role="combobox"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className={styles.clearBtn}
              aria-label="Clear search"
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div
            id="search-results"
            className={styles.results}
            ref={resultsRef}
            role="listbox"
            aria-label="Search results"
          >
            {results.map((result, index) => (
              <div
                key={result.id}
                className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ""}`}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={index === selectedIndex}
                id={`result-${result.id}`}
                tabIndex={-1}
              >
                <span className={styles.resultIcon}>{result.icon}</span>
                <div className={styles.resultContent}>
                  <div className={styles.resultTitle}>{result.title}</div>
                  {result.subtitle && <div className={styles.resultSubtitle}>{result.subtitle}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.searchContainer}>
      <div className={`${styles.searchBar} ${isOpen ? styles.open : ""}`}>
        <button
          onClick={onToggle}
          className={styles.searchTrigger}
          title="Search (Ctrl+K)"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            role="img"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span className={styles.searchPlaceholder}>Search...</span>
          <span className={styles.searchShortcut}>⌘K</span>
        </button>

        {isOpen && (
          <div className={styles.searchModal}>
            <div
              className={styles.searchModalOverlay}
              onClick={onClose}
              role="button"
              tabIndex={-1}
              aria-label="Close search"
            />
            <div className={styles.searchModalContent}>
              <div className={styles.searchInput}>
                <svg
                  className={styles.searchIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  role="img"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search chats, summaries, platforms..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={styles.input}
                  aria-label="Search input"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                  aria-expanded={results.length > 0}
                  aria-activedescendant={selectedIndex >= 0 ? `result-${results[selectedIndex]?.id}` : undefined}
                  role="combobox"
                  aria-haspopup="listbox"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className={styles.clearBtn}
                    aria-label="Clear search"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                )}
              </div>

              {results.length > 0 && (
                <div
                  id="search-results"
                  className={styles.results}
                  ref={resultsRef}
                  role="listbox"
                  aria-label="Search results"
                >
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ""}`}
                      onClick={() => handleResultClick(result)}
                      role="option"
                      aria-selected={index === selectedIndex}
                      id={`result-${result.id}`}
                    >
                      <span className={styles.resultIcon}>{result.icon}</span>
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>{result.title}</div>
                        {result.subtitle && <div className={styles.resultSubtitle}>{result.subtitle}</div>}
                      </div>
                      <div className={styles.resultType}>{result.type}</div>
                    </div>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <div className={styles.noResultsText}>No results found</div>
                </div>
              )}

              <div className={styles.searchFooter}>
                <div className={styles.searchTips}>
                  <span className={styles.tip}>↑↓ Navigate</span>
                  <span className={styles.tip}>↵ Select</span>
                  <span className={styles.tip}>Esc Close</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
