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
    <div className="bg-white rounded-none border border-gray-200 flex flex-col h-full shadow-none">
      <div className="flex gap-4 p-5">
        <div className="w-24 h-24 shrink-0 rounded-none overflow-hidden bg-white flex items-center justify-center border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={auction.thumbnailUrl} alt={auction.title} className="object-contain w-full h-full aspect-square" />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <h3 className="font-semibold text-[#222222] text-sm line-clamp-2 leading-snug mb-1" title={auction.title}>
              {auction.title}
            </h3>
            <div className="text-xs text-gray-500 font-medium">
              Stan: <span className="font-bold text-[#222222]">{auction.stock} szt.</span>
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <div>
              <div className="text-[10px] text-gray-400 font-bold mb-0.5 uppercase tracking-wider">Cena Sprzedaży</div>
              <span className="font-extrabold text-brand-orange text-lg tracking-tight">
                {auction.price.toFixed(2)} zł
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 space-y-4 border-t border-gray-200 mt-auto">
        <div className="flex flex-row justify-between items-center gap-3">
          <label className="text-xs font-bold text-gray-700">Cena zakupu netto</label>
          <div className="relative">
            <input 
              type="number" 
              value={auction.netPurchasePrice}
              onChange={(e) => updatePurchasePrice(id, parseFloat(e.target.value) || 0)}
              className="w-24 bg-white border border-gray-200 rounded-none py-1.5 px-2 text-sm font-bold text-[#222222] focus:ring-1 focus:ring-brand-orange focus:border-brand-orange outline-none transition-none text-right shadow-none"
            />
            <span className="absolute right-2 top-2 text-xs text-gray-400 pointer-events-none font-medium">zł</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Wyróżnienia (Symulacja)</label>
          <div className="grid grid-cols-1 gap-1.5">
            {availablePromos.map(promo => {
              const isActive = auction.activePromos.includes(promo.id);
              return (
                <label key={promo.id} className={`flex items-center justify-between p-2 rounded-none cursor-pointer border ${isActive ? 'bg-orange-50 border-brand-orange text-brand-orange' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={isActive}
                      onChange={() => togglePromo(id, promo.id)}
                      className="w-4 h-4 rounded-none border-gray-300 text-brand-orange focus:ring-brand-orange focus:ring-1"
                    />
                    <span className="font-semibold text-xs">{promo.name}</span>
                  </div>
                  <span className="text-xs font-bold opacity-80">-{promo.cost.toFixed(2)} zł</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center bg-[#222222] p-4 border-t border-gray-800">
        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Zysk na czysto</span>
        <span className={`font-black text-xl tracking-tight ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
          {netProfit > 0 ? '+' : ''}{netProfit.toFixed(2)} <span className="text-sm font-bold">zł</span>
        </span>
      </div>
    </div>
  );
}
