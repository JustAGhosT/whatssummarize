"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import styles from "./breadcrumb.module.css"

const pathLabels: Record<string, string> = {
  "/": "Dashboard",
  "/groups": "Groups",
  "/personal": "Personal",
  "/customize": "Customize",
  "/distribution": "Distribution",
  "/notifications": "Notifications",
  "/admin": "Admin Panel",
  "/settings": "Settings",
  "/profile": "Profile",
}

const pathIcons: Record<string, string> = {
  "/": "🏠",
  "/groups": "👥",
  "/personal": "👤",
  "/customize": "🎨",
  "/distribution": "📤",
  "/notifications": "🔔",
  "/admin": "🛠️",
  "/settings": "⚙️",
  "/profile": "👤",
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Don't show breadcrumb on homepage
  if (pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    ...pathSegments.map((segment, index) => {
      const path = "/" + pathSegments.slice(0, index + 1).join("/")
      return {
        path,
        label: pathLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1),
        icon: pathIcons[path] || "📄",
      }
    }),
  ]

  return (
    <div className={styles.breadcrumb}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Breadcrumb">
          <ol className={styles.list}>
            {breadcrumbItems.map((item, index) => (
              <li key={item.path} className={styles.item}>
                {index < breadcrumbItems.length - 1 ? (
                  <Link href={item.path} className={styles.link}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                ) : (
                  <span className={styles.current}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}</span>
                  </span>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <svg
                    className={styles.separator}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
