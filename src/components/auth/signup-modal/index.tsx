"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../../../contexts/auth-context"
import { Modal } from "../../common/modal"
import styles from "./signup-modal.module.css"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const { signup, isLoading, error, clearError } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    try {
      await signup(name, email, password)
      onClose()
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      // Error is handled by context
    }
  }

  const handleClose = () => {
    onClose()
    clearError()
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

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

        <div className={styles.field}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
            disabled={isLoading}
          />
          {password !== confirmPassword && confirmPassword && (
            <span className={styles.fieldError}>Passwords do not match</span>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isLoading || password !== confirmPassword}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        <div className={styles.footer}>
          <span>Already have an account?</span>
          <button type="button" onClick={onSwitchToLogin} className={styles.switchBtn}>
            Login
          </button>
        </div>
      </form>
    </Modal>
  )
}
