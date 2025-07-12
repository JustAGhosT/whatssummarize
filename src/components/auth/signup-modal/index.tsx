"use client"

import { Modal } from "../../common/modal"
import { SignupForm } from "../signup-form"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const handleSuccess = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create an account">
      <SignupForm 
        onSuccess={handleSuccess}
        onSwitchToLogin={() => {
          onClose()
          onSwitchToLogin()
        }}
        showHeader={false}
        className="space-y-4"
      />
    </Modal>
  )
}
