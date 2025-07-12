"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CORE_NAV_ITEMS, MORE_NAV_ITEMS, getUserMenuItems } from '../constants/navigation';
import { NavItem, UseNavigationReturn } from '../types';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDarkMode } from '@/hooks/useDarkMode';

export const useNavigation = (isAuthenticated: boolean) => {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // State for UI elements
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Refs for click outside detection with proper null checks
  const moreDropdownRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  
  // Click outside handlers for each dropdown
  const handleClickOutsideMore = useCallback((event: MouseEvent) => {
    if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
      setMoreDropdownOpen(false);
    }
  }, []);

  const handleClickOutsideUser = useCallback((event: MouseEvent) => {
    if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
      setUserDropdownOpen(false);
    }
  }, []);

  const handleClickOutsideMobile = useCallback((event: MouseEvent) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
      setMobileMenuOpen(false);
    }
  }, []);

  const handleClickOutsideSearch = useCallback((event: MouseEvent) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
      setSearchOpen(false);
    }
  }, []);

  // Filter navigation items based on auth state
  const filteredNavItems = CORE_NAV_ITEMS.filter(
    item => !item.requiresAuth || isAuthenticated
  );

  const filteredMoreItems = MORE_NAV_ITEMS.filter(
    item => !item.requiresAuth || isAuthenticated
  );

  const userMenuItems = getUserMenuItems(router, () => {
    // This will be handled by the actual logout function passed from the parent
  });

  // Toggle functions
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen(prev => !prev);
  }, []);

  const toggleMoreDropdown = useCallback(() => {
    setMoreDropdownOpen(prev => !prev);
  }, []);

  const toggleUserDropdown = useCallback(() => {
    setUserDropdownOpen(prev => !prev);
  }, []);

  // Set up click outside listeners
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideMore);
    document.addEventListener('mousedown', handleClickOutsideUser);
    document.addEventListener('mousedown', handleClickOutsideMobile);
    document.addEventListener('mousedown', handleClickOutsideSearch);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMore);
      document.removeEventListener('mousedown', handleClickOutsideUser);
      document.removeEventListener('mousedown', handleClickOutsideMobile);
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, [handleClickOutsideMore, handleClickOutsideUser, handleClickOutsideMobile, handleClickOutsideSearch]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle user menu item click
  const handleUserMenuItemClick = useCallback((e: React.MouseEvent, href?: string, onClick?: (e: React.MouseEvent) => void | Promise<void>) => {
    e.preventDefault();
    setUserDropdownOpen(false);
    if (onClick) {
      onClick(e);
    } else if (href) {
      router.push(href);
    }
  }, [router]);

  // Return the refs and other values
  return {
    isScrolled,
    mobileMenuOpen,
    searchOpen,
    moreDropdownOpen,
    userDropdownOpen,
    isDarkMode,
    toggleMobileMenu,
    toggleSearch,
    toggleMoreDropdown,
    toggleUserDropdown,
    toggleDarkMode,
    handleUserMenuItemClick,
    moreDropdownRef,
    userDropdownRef,
    mobileMenuRef,
    searchBarRef,
    filteredNavItems,
    filteredMoreItems,
    userMenuItems
  };
};
