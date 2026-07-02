"use client";

import { useState } from "react";
import { Package, FileText, Search, Filter } from "lucide-react";

export default function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Mock data for initial table
  const mockOrders = [
    { id: "10c9c7f1-1b5e", buyer: "jan_kowalski", paymentStatus: "Opłacone", amount: "145.00 PLN" },
    { id: "28f4a1a9-9f8d", buyer: "firma_xyz", paymentStatus: "Oczekuje", amount: "1,250.00 PLN" },
    { id: "94b2e8c3-4d7a", buyer: "anna_nowak", paymentStatus: "Opłacone", amount: "89.99 PLN" },
  ];

  const handleAction = (action: string) => {
    setToast(`Integracja w toku: ${action}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-gray-50 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-[#222222] text-white px-6 py-4 rounded-none shadow-none z-50 animate-in fade-in slide-in-from-top-4">
          <p className="font-semibold text-sm">{toast}</p>
        </div>
      )}

      <header className="mb-10 mt-4 md:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight">Zamówienia</h1>
          <p className="text-base text-gray-500 font-medium mt-1">Zarządzaj wysyłką i dokumentami sprzedaży.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Szukaj zamówienia..." 
              className="pl-9 pr-4 py-2 border border-gray-200 bg-white focus:outline-none focus:border-brand-orange text-sm rounded-none w-64 transition-none"
            />
          </div>
          <button className="bg-white rounded-none shadow-none border border-gray-200 p-2 text-gray-500 hover:text-brand-orange hover:border-brand-orange transition-none">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="bg-white border border-gray-200 rounded-none overflow-x-auto">
        <table className="w-full text-left text-sm text-[#222222]">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs font-bold text-gray-500">
            <tr>
              <th className="px-6 py-4">ID Zamówienia</th>
              <th className="px-6 py-4">Kupujący</th>
              <th className="px-6 py-4">Status Opłaty</th>
              <th className="px-6 py-4">Kwota</th>
              <th className="px-6 py-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-none">
                <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                <td className="px-6 py-4 font-semibold">{order.buyer}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold ${order.paymentStatus === 'Opłacone' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-brand-orange border border-orange-200'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">{order.amount}</td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button 
                    onClick={() => handleAction('InPost ShipX')}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange font-bold py-2 px-3 transition-none text-xs"
                  >
                    <Package className="w-4 h-4" />
                    Nadaj Paczkę
                  </button>
                  <button 
                    onClick={() => handleAction('Fakturownia')}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange font-bold py-2 px-3 transition-none text-xs"
                  >
                    <FileText className="w-4 h-4" />
                    Wystaw Fakturę
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mockOrders.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-500 font-medium">
            Brak zamówień do wyświetlenia.
          </div>
        )}
      </div>
    </div>
  );
}
