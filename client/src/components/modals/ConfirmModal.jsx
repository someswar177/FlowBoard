import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ConfirmModal({
  title = "Confirm Action",
  message = "Are you sure?",
  onConfirm,
  onCancel
}) {
  const deleteButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    deleteButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (document.activeElement === deleteButtonRef.current) {
        cancelButtonRef.current?.focus();
      }
    }
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (document.activeElement === cancelButtonRef.current) {
        deleteButtonRef.current?.focus();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-red-900/40 backdrop-blur-xs flex items-center justify-center z-50 px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm relative overflow-hidden border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-600"></div>

        <div className="flex items-start gap-4 mb-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <AlertTriangle className="w-5 h-5 text-white" />
          </motion.div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h2 id="confirm-modal-title" className="text-lg font-bold text-slate-900 tracking-tight mb-1.5">
              {title}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <motion.button
            whileHover={{ rotate: 90, scale: 1.1, backgroundColor: 'rgb(248 250 252)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </motion.button>
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            ref={cancelButtonRef}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 font-bold text-slate-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-500/10 relative overflow-hidden group"
          >
            <span className="relative z-10">Cancel</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.button>
          <motion.button
            ref={deleteButtonRef}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:via-rose-700 hover:to-red-800 text-white rounded-xl font-bold shadow-xl shadow-red-500/40 hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">Delete</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-rose-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%', skewX: -15 }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}