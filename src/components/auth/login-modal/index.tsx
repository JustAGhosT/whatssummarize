"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../../contexts/auth-context"
import { Modal } from "../../common/modal"
import styles from "./login-modal.module.css"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const { login, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      onClose()
      setEmail("")
      setPassword("")
    } catch (err) {
      // Error is handled by context
    }
  }

  const handleClose = () => {
    onClose()
    clearError()
    setEmail("")
    setPassword("")
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Login">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <button type="button" onClick={onSwitchToSignup} className={styles.switchBtn}>
            Sign up
          </button>
        </div>
      </form>
    </Modal>
  )
}
