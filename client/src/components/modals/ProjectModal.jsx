import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProjectModal({ project, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (project) {
      setFormData({ name: project.name, description: project.description });
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, created: new Date().toISOString() });
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500"></div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <FolderOpen className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {project ? 'Edit Project' : 'New Project'}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {project ? 'Update project details' : 'Create a new project to get started'}
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
                Project Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Website Redesign"
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                  placeholder="Brief description of your project goals and objectives..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none transition-all duration-200 text-slate-900 placeholder:text-slate-400 leading-relaxed"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-semibold text-slate-700 shadow-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -1, boxShadow: '0 12px 32px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                {project ? 'Update Project' : 'Create Project'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}