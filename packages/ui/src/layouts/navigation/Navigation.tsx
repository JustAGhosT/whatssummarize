"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  LogOut,
  Menu,
  Search as SearchIcon,
  Settings,
  User,
  X
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import { useNavigation } from "./hooks/useNavigation"
import styles from "./navigation.module.css"

type NavItem = {
  href: string
  label: string
  icon?: React.ReactNode
  requiresAuth?: boolean
  adminOnly?: boolean
}

interface NavLinkProps {
  item: NavItem
  isActive: boolean
  onClick?: () => void
  className?: string
}

function NavLink({ item, isActive, onClick, className = '' }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
        isActive
          ? 'border-green-500 text-gray-900 dark:text-white'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white',
        className
      )}
      onClick={onClick}
    >
      {item.label}
    </Link>
  )
}

function MobileNavLink({ item, isActive, onClick, className = '' }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        'block px-3 py-2 rounded-md text-base font-medium',
        isActive
          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
        className
      )}
      onClick={onClick}
    >
      {item.label}
    </Link>
  )
}

export function Navigation() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isScrolled, setIsScrolled] = React.useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const { mainNav, userNav } = useNavigation()

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const filteredMainNav = mainNav.filter(item => {
    if (item.requiresAuth && !user) return false
    if (item.adminOnly && !user?.isAdmin) return false
    return true
  })

  const filteredUserNav = user ? userNav.filter(item => !item.requiresAuth || user) : []

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300',
        isScrolled ? 'shadow-sm py-2' : 'py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  WhatsSummarize
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {filteredMainNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 w-full max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                />
              </div>
            </form>

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <span className="sr-only">Open user menu</span>
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {filteredUserNav.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="w-full">
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onSelect={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-b-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {filteredMainNav.map((item) => (
              <MobileNavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 px-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <User className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 p-2" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {filteredUserNav.map((item) => (
                    <MobileNavLink
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                    />
                  ))}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
