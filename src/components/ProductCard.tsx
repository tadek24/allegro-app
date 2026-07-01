"use client";

import { useStore } from "@/store/useStore";
import { calculateNetProfit } from "@/utils/calculations";

interface ProductCardProps {
  id: string;
}

export default function ProductCard({ id }: ProductCardProps) {
  const auction = useStore(state => state.auctions.find(a => a.id === id));
  const availablePromos = useStore(state => state.availablePromos);
  const updatePurchasePrice = useStore(state => state.updatePurchasePrice);
  const togglePromo = useStore(state => state.togglePromo);

  if (!auction) return null;

  const activePromoCost = availablePromos
    .filter(p => auction.activePromos.includes(p.id))
    .reduce((sum, p) => sum + p.cost, 0);

  const netProfit = calculateNetProfit(auction.price, auction.netPurchasePrice, activePromoCost);
  const isProfitable = netProfit > 0;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] mb-4 border border-white/50 dark:border-gray-700/50">
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={auction.thumbnailUrl} alt={auction.title} className="object-cover w-full h-full" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 leading-tight">
            {auction.title}
          </h3>
          <div className="flex justify-between items-end mt-1">
            <span className="font-bold text-brand-violet text-lg">
              {auction.price.toFixed(2)} zł
            </span>
            <div className="text-right text-xs text-gray-500">
              Stan: <span className="font-medium text-gray-900 dark:text-gray-200">{auction.stock} szt.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Cena zakupu netto</label>
          <div className="relative">
            <input 
              type="number" 
              value={auction.netPurchasePrice}
              onChange={(e) => updatePurchasePrice(id, parseFloat(e.target.value) || 0)}
              className="w-24 text-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 text-sm focus:ring-2 focus:ring-brand-violet outline-none"
            />
            <span className="absolute right-2 top-1.5 text-xs text-gray-400 pointer-events-none">zł</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Dostępne wyróżnienia</label>
          <div className="space-y-1">
            {availablePromos.map(promo => {
              const isActive = auction.activePromos.includes(promo.id);
              return (
                <label key={promo.id} className="flex items-center justify-between text-xs cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={() => togglePromo(id, promo.id)}
                      className="rounded border-gray-300 text-brand-violet focus:ring-brand-violet"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-brand-violet transition-colors">{promo.name}</span>
                  </div>
                  <span className="text-gray-500">{promo.cost.toFixed(2)} zł</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Zysk na czysto:</span>
        <span className={`font-bold text-lg ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
          {netProfit > 0 ? '+' : ''}{netProfit.toFixed(2)} zł
        </span>
      </div>
    </div>
  );
}
