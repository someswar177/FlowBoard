import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{project ? 'Edit Project' : 'New Project'}</h2>
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {project ? 'Update' : 'Create'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}