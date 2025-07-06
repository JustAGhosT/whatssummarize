"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import styles from "./breadcrumb.module.css"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

const routeMap: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: "Dashboard", icon: "🏠" }],
  "/groups": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Groups", icon: "👥" },
  ],
  "/personal": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Personal", icon: "👤" },
  ],
  "/distribution": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Distribution", icon: "📤" },
  ],
  "/cross-platform-groups": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Cross-Platform Groups", icon: "🔗" },
  ],
  "/customize": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Customize", icon: "🎨" },
  ],
  "/notifications": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Notifications", icon: "🔔" },
  ],
  "/admin": [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Admin", icon: "⚙️" },
  ],
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Don't show breadcrumb on homepage
  if (pathname === "/") {
    return null
  }

  const breadcrumbItems = routeMap[pathname] || [
    { label: "Dashboard", href: "/", icon: "🏠" },
    { label: "Page", icon: "📄" },
  ]

  return (
    <div className={styles.breadcrumb}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="Breadcrumb">
          <ol className={styles.list}>
            {breadcrumbItems.map((item, index) => (
              <li key={index} className={styles.item}>
                {item.href ? (
                  <Link href={item.href} className={styles.link}>
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                ) : (
                  <span className={styles.current}>
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    <span className={styles.label}>{item.label}</span>
                  </span>
                )}
                {index < breadcrumbItems.length - 1 && (
                  <span className={styles.separator}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
