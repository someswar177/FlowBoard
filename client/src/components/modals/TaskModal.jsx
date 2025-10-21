import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (task) {
      setFormData({ title: task.title, description: task.description });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-slate-800/60 backdrop-blur-xs flex items-center justify-center z-[100] px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-200/80 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500"></div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <CheckSquare className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {task ? 'Edit Task' : 'New Task'}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {task ? 'Update task details' : 'Add a new task to your project'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1, backgroundColor: 'rgb(248 250 252)' }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-slate-600" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Task Title
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Design landing page mockup"
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
                <span className="text-slate-400 font-normal ml-1">(optional)</span>
              </label>
              <div className="relative group">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add additional details, notes, or requirements for this task..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 resize-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 leading-relaxed"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 font-bold text-slate-700 shadow-sm hover:shadow-md relative overflow-hidden group"
              >
                <span className="relative z-10">Cancel</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {task ? 'Update Task' : 'Create Task'}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}