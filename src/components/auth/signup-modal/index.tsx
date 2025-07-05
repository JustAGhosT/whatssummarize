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
  const { state, signup, clearError } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [validationError, setValidationError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters")
      return
    }

    await signup(formData.name, formData.email, formData.password)
    if (!state.error) {
      onClose()
      setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    }
  }

  const handleClose = () => {
    onClose()
    clearError()
    setValidationError("")
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {(state.error || validationError) && <div className={styles.error}>{state.error || validationError}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              disabled={state.isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
              disabled={state.isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
              disabled={state.isLoading}
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="input-field"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              required
              disabled={state.isLoading}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className="btn-primary" disabled={state.isLoading} style={{ width: "100%" }}>
              {state.isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{" "}
            <button type="button" className={styles.switchButton} onClick={onSwitchToLogin} disabled={state.isLoading}>
              Log in
            </button>
          </p>
        </div>
      </div>
    </Modal>
  )
}
