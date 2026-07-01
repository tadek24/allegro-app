import data from "../../../data/mockData.json";
import MetricCard from "@/components/MetricCard";
import CampaignRow from "@/components/CampaignRow";
import { CircleDollarSign, ShoppingCart, Target, TrendingUp } from "lucide-react";

export default function AdsPage() {
  const { adsMetrics, campaigns } = data;

  return (
    <div className="p-4">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Allegro Ads</h1>
        <p className="text-sm text-gray-500">Podsumowanie kampanii (Ostatnie 30 dni)</p>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricCard 
          title="Wydatki" 
          value={`${adsMetrics.spend.toFixed(2)} zł`} 
          icon={<CircleDollarSign className="w-12 h-12" />} 
        />
        <MetricCard 
          title="Sprzedaż" 
          value={`${adsMetrics.sales.toFixed(2)} zł`} 
          icon={<ShoppingCart className="w-12 h-12" />}
          trend="+12% m/m"
          isPositive={true}
        />
        <MetricCard 
          title="Średnie CPC" 
          value={`${adsMetrics.cpc.toFixed(2)} zł`} 
          icon={<Target className="w-12 h-12" />} 
          trend="-0.05 zł"
          isPositive={true}
        />
        <MetricCard 
          title="ROAS" 
          value={adsMetrics.roas.toFixed(2)} 
          icon={<TrendingUp className="w-12 h-12" />} 
        />
      </div>

      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Aktywne kampanie</h3>
        <button className="text-brand-blue text-sm font-medium">Filtruj</button>
      </div>
      
      <div className="space-y-3 pb-8">
        {campaigns.map((campaign) => (
          <CampaignRow
            key={campaign.id}
            id={campaign.id}
            name={campaign.name}
            active={campaign.active}
            dailyBudget={campaign.dailyBudget}
            spend={campaign.spend}
          />
        ))}
      </div>
    </div>
  );
}
