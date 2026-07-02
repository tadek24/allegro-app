"use client";

import { useEffect, useState } from "react";
import { Package, FileText, Search, Filter, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  
  const isIntegrated = useStore(state => state.isIntegrated);

  useEffect(() => {
    let isMounted = true;
    async function fetchOrders() {
      if (!isIntegrated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch('/api/allegro/orders');
        if (!res.ok) {
          throw new Error('Nie udało się pobrać zamówień');
        }
        const data = await res.json();
        if (isMounted) setOrders(data.orders || []);
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOrders();
    return () => { isMounted = false; };
  }, [isIntegrated]);

  const handleAction = (action: string) => {
    setToast(`Integracja w toku: ${action}`);
    setTimeout(() => setToast(null), 3000);
  };

  if (!isIntegrated && !loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[50vh]">
        <div className="text-center p-8 bg-white border border-gray-200 shadow-none max-w-md">
          <AlertCircle className="w-12 h-12 text-brand-orange mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Brak Integracji</h2>
          <p className="text-gray-500 text-sm mb-6">Musisz połączyć konto z Allegro w Ustawieniach, by pobrać zamówienia.</p>
          <Link href="/dashboard/settings" className="bg-brand-orange hover:bg-orange-600 text-white px-6 py-2 font-bold transition-none">Przejdź do Ustawień</Link>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 border border-red-100 font-semibold text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-none overflow-x-auto">
        <table className="w-full text-left text-sm text-[#222222]">
          <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs font-bold text-gray-500">
            <tr>
              <th className="px-6 py-4">ID Zamówienia</th>
              <th className="px-6 py-4">Źródło</th>
              <th className="px-6 py-4">Kupujący</th>
              <th className="px-6 py-4">Status Opłaty</th>
              <th className="px-6 py-4">Kwota</th>
              <th className="px-6 py-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Synchronizacja zamówień z bazy...
                </td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-none">
                <td className="px-6 py-4 font-mono font-medium">
                  <Link href={`/dashboard/orders/${order.id}`} className="text-brand-orange hover:underline font-bold">
                    {order.external_order_id?.split('-')[0] || order.id.split('-')[0]}
                  </Link>
                </td>
                <td className="px-6 py-4 font-bold uppercase text-[10px] text-gray-500">{order.platform_source}</td>
                <td className="px-6 py-4 font-semibold">{order.buyer_name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-brand-orange border border-orange-200'}`}>
                    {order.payment_status === 'paid' ? 'Opłacone' : 'Oczekuje'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">{order.total_amount} {order.currency}</td>
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
        {orders.length === 0 && !loading && !error && (
          <div className="p-12 text-center text-gray-500 font-medium border-t border-gray-200">
            Brak zamówień w systemie Omnichannel.
          </div>
        )}
      </div>
    </div>
  );
}
