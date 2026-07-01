"use client";

import { useState } from "react";

interface CampaignRowProps {
  id: string;
  name: string;
  active: boolean;
  dailyBudget: number;
  spend: number;
}

export default function CampaignRow({ name, active: initialActive, dailyBudget, spend }: CampaignRowProps) {
  const [active, setActive] = useState(initialActive);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
      <div className="flex flex-col flex-1">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{name}</h4>
        <div className="flex gap-4 text-xs text-gray-500">
          <div>Budżet: <span className="font-medium text-gray-700 dark:text-gray-300">{dailyBudget.toFixed(0)} zł</span></div>
          <div>Wydano: <span className="font-medium text-brand-blue">{spend.toFixed(2)} zł</span></div>
        </div>
      </div>
      
      {/* Toggle switch */}
      <button 
        onClick={() => setActive(!active)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 ${
          active ? 'bg-brand-violet' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        role="switch"
        aria-checked={active}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            active ? 'translate-x-6' : 'translate-x-1'
          }`} 
        />
      </button>
    </div>
  );
}
