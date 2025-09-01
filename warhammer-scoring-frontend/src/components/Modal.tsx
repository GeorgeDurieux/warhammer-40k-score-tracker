import { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import type { ModalProps } from '../types/ModalProps'

export default function Modal({ isOpen, title, children, onClose, onConfirm, confirmText }: ModalProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  // Animate when isOpen changes
  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true)
    } else {
      const timeout = setTimeout(() => setShowAnimation(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  // If closed and animation is done, don't render
  if (!isOpen && !showAnimation) return null

  return (
    <div
        className={`fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/40 backdrop-blur-sm
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
        <div
            className={`bg-gray-15 text-slate-50 rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative transition-transform duration-300 animate-fadeInModal ${isOpen ? 'scale-100' : 'scale-90'}`}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-slate-25 hover:text-slate-50 hover:scale-110 transition-all duration-250 text-xl cursor-pointer"
            >
                ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-600 pb-2">
                {title}
            </h2>

            {/* Scrollable content */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">{children}</div>

            {/* Footer with close button and optional confirm */}
            <div className="mt-4 flex justify-end gap-2">
                {onConfirm && (
                    <CustomButton 
                        onClick={onConfirm} 
                        isSmall
                    >
                        {confirmText || 'Confirm'}
                    </CustomButton>
                )}
                <CustomButton 
                    onClick={onClose} 
                    isSmall
                >
                    Close
                </CustomButton>
            </div>
            
        </div>
    </div>
  )
}
