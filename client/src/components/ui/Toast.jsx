import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose = () => {} }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2700);

    return () => clearTimeout(hideTimer);
  }, []);

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
            if (!isVisible) {
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