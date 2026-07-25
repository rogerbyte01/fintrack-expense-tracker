import React, { useState } from 'react';

const InsightBanner = ({ insights }) => {
  const [dismissedCategories, setDismissedCategories] = useState([]);

  if (!insights || insights.length === 0) return null;

  const activeInsights = insights.filter(
    insight => !dismissedCategories.includes(insight.category.toLowerCase())
  );

  if (activeInsights.length === 0) return null;

  const handleDismiss = (category) => {
    setDismissedCategories([...dismissedCategories, category.toLowerCase()]);
  };

  return (
    <div className="space-y-3 animate-fade-in">
      {activeInsights.map((insight) => {
        const catName = insight.category.charAt(0).toUpperCase() + insight.category.slice(1);
        return (
          <div 
            key={insight.category}
            className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-[var(--text-primary)] flex items-start justify-between gap-4 animate-slide-up shadow-sm"
          >
            <div className="flex gap-3">
              <span className="text-lg mt-0.5">💡</span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500">Spending Alert</h4>
                <p className="text-sm font-medium mt-1 leading-normal">
                  You spent <span className="font-bold text-rose-600 dark:text-rose-400">{insight.percentAbove}% more</span> on <span className="font-bold">{catName}</span> than your usual 3-month average of ₹{Math.round(insight.averageSpend).toLocaleString()}.
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Current month spend: ₹{insight.currentSpend.toLocaleString()} vs average: ₹{Math.round(insight.averageSpend).toLocaleString()}.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleDismiss(insight.category)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
              title="Dismiss alert"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default InsightBanner;
