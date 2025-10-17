import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  const variants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.9 },
  };

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 ${
            typeStyles[toast.type] || typeStyles.info
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
