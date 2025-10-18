import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { aiService } from '../../api/aiService';

export default function ColumnSummarizer({ columnTitle, tasks, onClose }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const projectData = {
        name: `Tasks in "${columnTitle}" column`,
        description: `This is a summary for the tasks currently in the "${columnTitle}" status.`,
        tasks: tasks.map((t) => ({ title: t.title, description: t.description, status: t.status })),
      };
      const result = await aiService.summarizeProject(projectData);
      setSummary(result.summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute top-12 right-0 w-80 bg-violet-50 border border-border rounded-xl shadow-xl p-4 z-40"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm">AI Summary</h3>
          </div>
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {error && <p className="text-sm text-destructive mb-3">{error}</p>}

        {!summary ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSummarize}
            disabled={isLoading}
            className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Summarizing...
              </div>
            ) : (
              `Summarize "${columnTitle}"`
            )}
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSummarize}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              {isLoading ? 'Regenerating...' : 'Get Another Summary'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}