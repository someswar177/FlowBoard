import React from 'react';
import { Menu } from 'lucide-react';

export default function KanbanPageSkeleton({ isSidebarOpen, onToggleSidebar }) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {!isSidebarOpen && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <div className="min-w-0 flex-1 animate-pulse">
            <div className="h-6 sm:h-8 bg-slate-200 rounded w-48 mb-1"></div>
            <div className="h-3 sm:h-4 bg-slate-200 rounded w-32 hidden sm:block"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-6 h-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] sm:w-86 bg-white/50 border-2 border-slate-200 rounded-2xl shadow-sm animate-pulse"
            >
              <div className="p-3 sm:p-4 border-b border-slate-200">
                <div className="h-8 bg-slate-200 rounded-lg w-32 mb-3"></div>
                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
              </div>
              <div className="p-2 sm:p-3 space-y-2">
                {[1, 2].map((j) => (
                  <div key={j} className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}