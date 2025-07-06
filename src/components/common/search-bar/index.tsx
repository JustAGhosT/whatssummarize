"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./search-bar.module.css"

interface SearchBarProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  isMobile?: boolean
}

export function SearchBar({ isOpen, onToggle, onClose, isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      // Simulate search API call
      const timer = setTimeout(() => {
        setResults([
          { type: "summary", title: "Family Group Chat", date: "2024-01-15", id: "1" },
          { type: "summary", title: "Work Team Discussion", date: "2024-01-14", id: "2" },
          { type: "page", title: "Dashboard", path: "/", icon: "🏠" },
          { type: "page", title: "Groups", path: "/groups", icon: "👥" },
        ])
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  const handleResultClick = (result: any) => {
    if (result.type === "page") {
      router.push(result.path)
    } else {
      router.push(`/summary/${result.id}`)
    }
    onClose()
    setQuery("")
  }

  if (isMobile) {
    return (
      <div className={styles.mobileSearchContainer}>
        <div className={styles.searchInputContainer}>
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search summaries, groups..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          {query && (
            <button onClick={() => setQuery("")} className={styles.clearButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {(results.length > 0 || isLoading) && (
          <div className={styles.searchResults}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <span>Searching...</span>
              </div>
            ) : (
              results.map((result, index) => (
                <button key={index} className={styles.searchResult} onClick={() => handleResultClick(result)}>
                  <div className={styles.resultIcon}>{result.type === "page" ? result.icon : "📄"}</div>
                  <div className={styles.resultContent}>
                    <div className={styles.resultTitle}>{result.title}</div>
                    {result.date && <div className={styles.resultMeta}>{result.date}</div>}
                  </div>
                  <div className={styles.resultType}>{result.type === "page" ? "Page" : "Summary"}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.searchContainer}>
      <button
        className={`${styles.searchTrigger} ${isOpen ? styles.active : ""}`}
        onClick={onToggle}
        title="Search (Ctrl+K)"
      >
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <span className={styles.searchPlaceholder}>Search...</span>
        <div className={styles.searchShortcut}>⌘K</div>
      </button>

      {isOpen && (
        <div className={styles.searchModal}>
          <div className={styles.searchModalOverlay} onClick={onClose} />
          <div className={styles.searchModalContent}>
            <div className={styles.searchInputContainer}>
              <svg
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search summaries, groups, pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={onClose} className={styles.closeButton} title="Close (Esc)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {(results.length > 0 || isLoading) && (
              <div className={styles.searchResults}>
                {isLoading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  results.map((result, index) => (
                    <button key={index} className={styles.searchResult} onClick={() => handleResultClick(result)}>
                      <div className={styles.resultIcon}>{result.type === "page" ? result.icon : "📄"}</div>
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>{result.title}</div>
                        {result.date && <div className={styles.resultMeta}>{result.date}</div>}
                      </div>
                      <div className={styles.resultType}>{result.type === "page" ? "Page" : "Summary"}</div>
                    </button>
                  ))
                )}
              </div>
            )}

            {query.length > 0 && results.length === 0 && !isLoading && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <div className={styles.noResultsText}>No results found</div>
                <div className={styles.noResultsSubtext}>Try a different search term</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
