"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search as SearchIcon, X } from "lucide-react"
import { cn } from "../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface SearchInputProps extends InputProps {
  isLoading?: boolean
  showClearButton?: boolean
  onClear?: () => void
  error?: string
  icon?: React.ReactNode
  animationType?: 'fade' | 'slide' | 'scale'
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({
  isLoading = false,
  showClearButton = false,
  onClear,
  error,
  icon = <SearchIcon className="h-4 w-4 text-muted-foreground" />,
  animationType = 'fade',
  className,
  value: propValue,
  onChange,
  ...props
}, ref) => {
  const [value, setValue] = React.useState(propValue || '')
  const isControlled = propValue !== undefined
  const displayValue = isControlled ? propValue : value

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setValue(e.target.value)
    }
    onChange?.(e)
  }

  const handleClear = () => {
    if (!isControlled) {
      setValue('')
    }
    onClear?.()
  }

  const animationVariants = {
    fade: {
      initial: { opacity: 0, y: 5 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -5 },
    },
    slide: {
      initial: { x: -10, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 10, opacity: 0 },
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
    },
  }

  const currentVariant = animationVariants[animationType] || animationVariants.fade

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            icon
          )}
        </div>
        <Input
          ref={ref}
          type="text"
          className={cn(
            'w-full pl-10 pr-8',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          value={displayValue}
          onChange={handleChange}
          {...props}
        />
        {showClearButton && displayValue && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={currentVariant}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

SearchInput.displayName = "SearchInput"

export { Input }
