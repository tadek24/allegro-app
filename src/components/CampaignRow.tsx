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
    <div className="bg-white rounded-none p-4 mb-3 border border-gray-200 shadow-none flex items-center justify-between">
      <div className="flex flex-col flex-1">
        <h4 className="font-semibold text-sm text-[#222222] mb-1">{campaign.name}</h4>
        <div className="flex gap-4 text-xs text-gray-500 font-medium">
          <div>Budżet: <span className="font-bold text-gray-700">{campaign.budget.toFixed(0)} zł</span></div>
          <div>Wydano: <span className="font-bold text-brand-orange">{campaign.spent.toFixed(2)} zł</span></div>
          <div>ROI: <span className="font-bold text-green-500">{campaign.roi}%</span></div>
        </div>
      </div>
      
      {/* Toggle switch */}
      <button 
        onClick={() => toggleCampaign(id)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-none border border-gray-300 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-orange focus:ring-offset-1 ${
          campaign.active ? 'bg-brand-orange border-brand-orange' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={campaign.active}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-none bg-white transition-transform ${
            campaign.active ? 'translate-x-6' : 'translate-x-1'
          }`} 
        />
      </button>
    </div>
  );
}
