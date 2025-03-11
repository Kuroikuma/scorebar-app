"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function ModalOne({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current === e.target) {
        onClose()
      }
    }

    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  // Focus trap and management
  useEffect(() => {
    if (isOpen) {
      // Save the active element to restore focus later
      const previousActiveElement = document.activeElement as HTMLElement

      // Focus the modal when it opens
      if (modalRef.current) {
        modalRef.current.focus()
      }

      // Restore focus when modal closes
      return () => {
        previousActiveElement?.focus?.()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="fixed inset-0 bg-black/40 animate-fadeIn" onClick={onClose} />

      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900",
          "border border-gray-200 dark:border-gray-800 animate-scaleIn",
          className,
        )}
        tabIndex={-1}
      >
        <div className="relative">
          {/* Decorative header gradient */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="p-6">
            <div className="flex items-center justify-between">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900 dark:text-white animate-fadeSlideDown"
                >
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-gray-700 hover:rotate-90 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

