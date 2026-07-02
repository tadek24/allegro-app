import { createClient } from "@/utils/supabase/server";
import { Package, Truck, User, MapPin, CreditCard, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Layout handle auth redirect
  }

  const { data: order, error } = await supabase
    .from('global_orders')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !order) {
    console.error("Order load error", error);
    notFound();
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-gray-50 text-[#222222]">
      
      <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange mb-6 text-sm font-bold transition-none">
        <ArrowLeft className="w-4 h-4" /> Wróć do zamówień
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Zamówienie {order.external_order_id.split('-')[0]}</h1>
          <p className="text-sm font-bold text-gray-500 mt-2 flex items-center gap-2">
            Źródło: <span className="uppercase bg-gray-200 text-gray-700 px-2 py-0.5">{order.platform_source}</span>
            Data: {new Date(order.created_at).toLocaleString('pl-PL')}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-[#222222] font-bold py-2 px-4 shadow-none hover:border-brand-orange hover:text-brand-orange text-sm flex items-center gap-2 transition-none">
            <Package className="w-4 h-4" /> Nadaj InPost
          </button>
          <button className="bg-brand-orange text-white font-bold py-2 px-4 shadow-none hover:bg-orange-600 text-sm flex items-center gap-2 transition-none">
            <Truck className="w-4 h-4" /> Własny Kurier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Products & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <div className="bg-white border border-gray-200 p-6 rounded-none shadow-none">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Package className="w-5 h-5 text-gray-400" /> Lista Produktów
            </h2>
            <div className="divide-y divide-gray-100">
              {order.line_items.map((item: any, i: number) => (
                <div key={i} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{item.offer?.name || 'Produkt Allegro'}</p>
                    <p className="text-sm text-gray-500 mt-1">Oferta ID: {item.offer?.id || 'Brak'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{item.price?.amount} {item.price?.currency}</p>
                    <p className="text-sm text-gray-500">Ilość: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 p-4 font-bold text-lg">
              <span>Razem do zapłaty</span>
              <span className="text-brand-orange">{order.total_amount} {order.currency}</span>
            </div>
          </div>
          
          {/* Payment Status */}
          <div className="bg-white border border-gray-200 p-6 rounded-none shadow-none">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
              <CreditCard className="w-5 h-5 text-gray-400" /> Płatność
            </h2>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 font-bold text-sm ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-brand-orange border border-orange-200'}`}>
                {order.payment_status === 'paid' ? 'PŁATNOŚĆ ZAKOŃCZONA' : 'OCZEKUJE NA WPŁATĘ'}
              </div>
              <p className="text-sm text-gray-500">Oczekiwano: {order.total_amount} {order.currency}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 p-6 rounded-none shadow-none">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
              <User className="w-5 h-5 text-gray-400" /> Kupujący
            </h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 block text-xs uppercase font-bold mb-1">Login / Imię</span> <span className="font-semibold">{order.buyer_name}</span></p>
              <p><span className="text-gray-500 block text-xs uppercase font-bold mb-1">Email</span> <span className="font-semibold">{order.buyer_email || 'Brak danych'}</span></p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white border border-gray-200 p-6 rounded-none shadow-none">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
              <MapPin className="w-5 h-5 text-gray-400" /> Adres Dostawy
            </h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 block text-xs uppercase font-bold mb-1">Metoda Dostawy</span> <span className="font-bold text-brand-orange">{order.shipping_method}</span></p>
              
              <div className="bg-gray-50 p-4 border border-gray-200 mt-4">
                <p className="font-bold">{order.delivery_address?.firstName} {order.delivery_address?.lastName}</p>
                <p>{order.delivery_address?.street}</p>
                <p>{order.delivery_address?.zipCode} {order.delivery_address?.city}</p>
                <p className="mt-2 font-semibold">Tel: {order.delivery_address?.phoneNumber || 'Brak'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
