"use client"

import { Modal } from "../../common/modal"
import { LoginForm } from "../login-form"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const handleSuccess = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign in to your account">
      <LoginForm 
        onSuccess={handleSuccess}
        showHeader={false}
        showSocialLogins={false}
        showSignupLink={false}
        className="space-y-4"
      />
      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <button
          type="button"
          onClick={() => {
            onClose()
            onSwitchToSignup()
          }}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </div>
    </Modal>
  )
}
