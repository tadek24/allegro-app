"use client";

import data from "../../../data/mockData.json";
import CompetitorRow from "@/components/CompetitorRow";
import { Search, Lightbulb } from "lucide-react";
import { useStore } from "@/store/useStore";
import { calculateNetProfit } from "@/utils/calculations";

export default function AnalysisPage() {
  const { competitors } = data; // Keep competitors from mock data for now
  const auction = useStore(state => state.auctions.find(a => a.id === "1001")); // Using the first auction for demo
  const updateAuctionPrice = useStore(state => state.updateAuctionPrice);
  const availablePromos = useStore(state => state.availablePromos);
  
  // Find the lowest price
  const lowestPrice = Math.min(...competitors.map(c => c.price));
  const suggestedPrice = lowestPrice - 0.10; // 10 groszy cheaper

  // Calculate simulated profit
  const activePromoCost = auction 
    ? availablePromos.filter(p => auction.activePromos.includes(p.id)).reduce((s, p) => s + p.cost, 0)
    : 0;
  
  const currentProfit = auction ? calculateNetProfit(auction.price, auction.netPurchasePrice, activePromoCost) : 0;
  const simulatedProfit = auction ? calculateNetProfit(suggestedPrice, auction.netPurchasePrice, activePromoCost) : 0;
  const profitDiff = simulatedProfit - currentProfit;

  return (
    <div className="p-4">
      <header className="mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analiza Konkurencji</h1>
        <p className="text-sm text-gray-500">Sprawdź ceny na rynku</p>
      </header>

      {/* Search */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] border border-white/50 dark:border-gray-700/50 p-2 flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input 
          type="text" 
          placeholder="Wpisz EAN lub nazwę produktu" 
          className="bg-transparent border-none outline-none w-full text-sm py-2 text-gray-900 dark:text-gray-100"
          defaultValue="Smartfon Samsung Galaxy S23"
        />
        <button className="bg-brand-violet text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors shadow-md shadow-brand-violet/20">
          Szukaj
        </button>
      </div>

      {/* Suggestion Card */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-brand-violet/30 rounded-xl p-4 mb-6 relative overflow-hidden shadow-[0_4px_20px_-4px_rgba(139,92,246,0.15)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-violet/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex items-start gap-3 relative z-10">
          <div className="bg-brand-violet/20 p-2 rounded-full text-brand-violet">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-brand-violet text-sm flex justify-between items-center">
              Smart Price
              <span className="text-xs bg-brand-violet text-white px-2 py-0.5 rounded-full">Propozycja</span>
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Bądź tańszy o 10 gr od lidera. Ustaw cenę na <span className="font-bold text-brand-violet">{suggestedPrice.toFixed(2)} zł</span>.
            </p>
            {auction && (
              <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Symulowany zysk:</div>
                  <div className={`font-bold ${simulatedProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {simulatedProfit.toFixed(2)} zł
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Zmiana zysku:</div>
                  <div className={`text-sm font-medium ${profitDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profitDiff > 0 ? '+' : ''}{profitDiff.toFixed(2)} zł
                  </div>
                </div>
              </div>
            )}
            <button 
              onClick={() => auction && updateAuctionPrice(auction.id, suggestedPrice)}
              className="mt-4 w-full bg-brand-violet text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors shadow-md shadow-brand-violet/20"
            >
              Zastosuj cenę do powiązanej aukcji
            </button>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 px-1">Oferty konkurencji</h3>
      
      <div className="space-y-3 pb-8">
        {competitors.sort((a, b) => a.price - b.price).map((competitor) => (
          <CompetitorRow
            key={competitor.id}
            seller={competitor.seller}
            price={competitor.price}
            shipping={competitor.shipping}
            deliveryTime={competitor.deliveryTime}
            isLowest={competitor.price === lowestPrice}
          />
        ))}
      </div>
    </div>
  );
}
