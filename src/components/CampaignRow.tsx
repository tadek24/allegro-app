"use client";

import { useStore } from "@/store/useStore";

interface CampaignRowProps {
  id: string;
}

export default function CampaignRow({ id }: CampaignRowProps) {
  const campaign = useStore(state => state.campaigns.find(c => c.id === id));
  const toggleCampaign = useStore(state => state.toggleCampaign);

  if (!campaign) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 mb-3 border border-white/50 dark:border-gray-700/50 shadow-sm flex items-center justify-between">
      <div className="flex flex-col flex-1">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{campaign.name}</h4>
        <div className="flex gap-4 text-xs text-gray-500">
          <div>Budżet: <span className="font-medium text-gray-700 dark:text-gray-300">{campaign.dailyBudget.toFixed(0)} zł</span></div>
          <div>Wydano: <span className="font-medium text-brand-violet">{campaign.spend.toFixed(2)} zł</span></div>
        </div>
      </div>
      
      {/* Toggle switch */}
      <button 
        onClick={() => toggleCampaign(id)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-violet focus:ring-offset-2 ${
          campaign.active ? 'bg-brand-violet' : 'bg-gray-200 dark:bg-gray-700'
        }`}
        role="switch"
        aria-checked={campaign.active}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            campaign.active ? 'translate-x-6' : 'translate-x-1'
          }`} 
        />
      </button>
    </div>
  );
}
