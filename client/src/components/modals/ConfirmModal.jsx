import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react"; // 1. Import hooks

export default function ConfirmModal({ 
  title = "Confirm Action", 
  message = "Are you sure?", 
  onConfirm, 
  onCancel 
}) {
  const deleteButtonRef = useRef(null); // 2. Create ref for Delete button
  const cancelButtonRef = useRef(null); // 2. Create ref for Cancel button

  // 3. Set focus to the delete button when the modal opens
  useEffect(() => {
    deleteButtonRef.current?.focus();
  }, []);

  // 4. Handle keyboard navigation
  const handleKeyDown = (e) => {
    // On Escape key, cancel the modal
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
    // On ArrowLeft, move focus from Delete to Cancel
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (document.activeElement === deleteButtonRef.current) {
        cancelButtonRef.current?.focus();
      }
    }
    // On ArrowRight, move focus from Cancel to Delete
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (document.activeElement === cancelButtonRef.current) {
        deleteButtonRef.current?.focus();
      }
    }
    // Note: The 'Enter' key is handled automatically.
    // When a button is focused, 'Enter' triggers its 'onClick' event.
    // Since we default focus to 'Delete', 'Enter' will trigger 'onConfirm'.
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      // Add onClick to the overlay to close, but stop propagation on the modal itself
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-[90%] sm:w-[400px] relative"
        onClick={(e) => e.stopPropagation()} // Prevents overlay click from firing
        onKeyDown={handleKeyDown} // 4. Add the keydown handler
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="confirm-modal-title" className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 text-sm mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            ref={cancelButtonRef} // 2. Attach ref
            onClick={onCancel}
            // Added focus styles for keyboard navigation
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          >
            Cancel
          </button>
          <button
            ref={deleteButtonRef} // 2. Attach ref
            onClick={onConfirm}
            // Added focus styles for keyboard navigation
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}