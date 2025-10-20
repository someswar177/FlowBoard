import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react'; // 1. useRef is imported
import { aiService } from '../../api/aiService';
import { marked } from 'marked';

export default function ColumnSummarizer({ projectId, columnName, onClose }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to AI...');
  const summarizerRef = useRef(null); // 2. Create a ref for the component's wrapper

  // --- NEW: Logic to handle clicking outside the component ---
  useEffect(() => {
    function handleClickOutside(event) {
      // If the ref is attached and the click is outside the ref's element
      if (summarizerRef.current && !summarizerRef.current.contains(event.target)) {
        onClose(); // Trigger the close function from the parent
      }
    }
    // Add the event listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // The hook depends on the onClose function
  // --- END OF NEW LOGIC ---

  // This useEffect for loading messages remains unchanged
  useEffect(() => {
    let timeouts = [];
    if (isLoading) {
      const messages = [
        'Analyzing tasks...',
        'Identifying patterns...',
        'Crafting your summary...',
      ];
      let i = 0;
      setLoadingMessage('Connecting to AI...');
      const updateMessage = () => {
        if (i < messages.length) {
          setLoadingMessage(messages[i]);
          i++;
          timeouts.push(setTimeout(updateMessage, 2000));
        }
      };
      timeouts.push(setTimeout(updateMessage, 1500));
    }
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isLoading]);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await aiService.summarizeProject(projectId, columnName);
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
        ref={summarizerRef} // 3. Attach the ref to the main div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute top-14 right-0 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-strong p-4 z-40"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">AI Summary</h3>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </motion.button>
        </div>

        {error && <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded-lg">{error}</p>}

        {!summary ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSummarize}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-md transition-all disabled:opacity-50 text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                {loadingMessage}
              </div>
            ) : (
              `Summarize "${columnName}" Column`
            )}
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
              <div
                className="text-sm text-slate-700 leading-relaxed space-y-2 prose prose-sm"
                dangerouslySetInnerHTML={{ __html: marked.parse(summary) }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSummarize}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700"
            >
              {isLoading ? 'Regenerating...' : 'Regenerate Summary'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}