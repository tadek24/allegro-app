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
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 border border-white/60 dark:border-gray-800 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={auction.thumbnailUrl} alt={auction.title} className="object-cover w-full h-full" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg sm:text-xl line-clamp-2 leading-tight tracking-tight mb-2">
              {auction.title}
            </h3>
            <div className="text-sm text-gray-500 font-medium">
              Stan magazynowy: <span className="font-bold text-gray-900 dark:text-gray-200">{auction.stock} szt.</span>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Cena Sprzedaży</div>
              <span className="font-extrabold text-brand-violet text-2xl tracking-tight">
                {auction.price.toFixed(2)} zł
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E4EFEB]/50 dark:bg-gray-950/50 rounded-2xl p-5 space-y-5 border border-white/30 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cena zakupu netto</label>
          <div className="relative">
            <input 
              type="number" 
              value={auction.netPurchasePrice}
              onChange={(e) => updatePurchasePrice(id, parseFloat(e.target.value) || 0)}
              className="w-32 bg-white/80 dark:bg-gray-800 border-none rounded-xl py-2 px-3 text-base font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-violet outline-none shadow-sm transition-all text-right"
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-400 pointer-events-none font-medium">zł</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-3">Wyróżnienia (Symulacja Kosztu)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availablePromos.map(promo => {
              const isActive = auction.activePromos.includes(promo.id);
              return (
                <label key={promo.id} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${isActive ? 'bg-brand-violet/10 border-brand-violet/30 text-brand-violet' : 'bg-white/50 dark:bg-gray-800/50 border-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={() => togglePromo(id, promo.id)}
                      className="w-5 h-5 rounded border-gray-300 text-brand-violet focus:ring-brand-violet"
                    />
                    <span className="font-semibold text-sm">{promo.name}</span>
                  </div>
                  <span className="text-sm font-bold opacity-80">-{promo.cost.toFixed(2)} zł</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-900 dark:bg-black rounded-2xl p-5 shadow-lg">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-0">Zysk na czysto</span>
        <span className={`font-black text-3xl tracking-tight ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
          {netProfit > 0 ? '+' : ''}{netProfit.toFixed(2)} <span className="text-xl">zł</span>
        </span>
      </div>
    </div>
  );
}
