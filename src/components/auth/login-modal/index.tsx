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
  const { state, login, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(formData.email, formData.password)
    if (!state.error) {
      onClose()
      setFormData({ email: "", password: "" })
    }
  }

  const handleClose = () => {
    onClose()
    clearError()
    setFormData({ email: "", password: "" })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log In">
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {state.error && <div className={styles.error}>{state.error}</div>}

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
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className="btn-primary" disabled={state.isLoading} style={{ width: "100%" }}>
              {state.isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <button type="button" className={styles.switchButton} onClick={onSwitchToSignup} disabled={state.isLoading}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  )
}
