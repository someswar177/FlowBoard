import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function AddColumnForm({ onAddColumn, onCancel }) {
  const [columnName, setColumnName] = useState('');

  const handleSubmit = () => {
    onAddColumn(columnName);
    setColumnName('');
    onCancel(); 
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border-2 border-slate-200 bg-slate-50/80 shadow-sm w-[280px] sm:w-86 p-3 sm:p-4"
    >
      <input
        type="text"
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        placeholder="Enter column name..."
        autoFocus
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
      />
      <div className="flex items-center gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm"
        >
          Add Column
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onCancel}
          className="p-2 hover:bg-slate-200/60 rounded-lg"
        >
          <X className="w-4 h-4 text-slate-600" />
        </motion.button>
      </div>
    </motion.div>
  );
}