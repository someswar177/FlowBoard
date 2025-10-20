// src/components/ui/Toast.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose = () => {} }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Step 1: after timeout, start exit animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2700);

    return () => clearTimeout(hideTimer);
  }, []);

  // Step 2: when the exit animation completes, call onClose to clear toast from context
  const handleAnimationComplete = (definition) => {
    // Framer Motion calls this when animation finishes - we want to detect exit completion
    // We'll not rely on this here; instead use onAnimationComplete on exit is tricky.
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ duration: 0.28 }}
          onAnimationComplete={(definition) => {
            // If animation finished and we are not visible, call onClose.
            // Note: This callback fires for both enter and exit. So only call onClose
            // if we are not visible anymore (i.e., the component has been told to exit)
            if (!isVisible) {
              // small timeout to ensure DOM updated before we clear context
              setTimeout(() => onClose(), 40);
            }
          }}
          className={`fixed top-6 left-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 shadow-lg ${styles[type]}`}
          style={{ maxWidth: '90vw', transform: 'translateX(-50%)' }}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <p className="font-semibold text-sm">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              // schedule onClose slightly later (exit animation)
              setTimeout(() => onClose(), 300);
            }}
            className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}