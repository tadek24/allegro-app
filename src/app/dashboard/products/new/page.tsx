"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { PackagePlus, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const isIntegrated = useStore(state => state.isIntegrated);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // PIM Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "1",
    description: "",
    categoryId: "257222" // Domyślna kategoria testowa Allegro
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Przygotowanie payloadu pod Allegro /sale/offers
      const offerPayload = {
        name: formData.name,
        category: { id: formData.categoryId },
        sellingMode: {
          format: "BUY_NOW",
          price: { amount: formData.price, currency: "PLN" }
        },
        stock: { available: parseInt(formData.stock), unit: "UNIT" },
        publication: { status: "INACTIVE" } // Tworzymy jako szkic (Draft)
      };

      const res = await fetch('/api/allegro/offers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerPayload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Wystąpił błąd podczas wysyłania do Allegro');
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isIntegrated) {
    return (
      <div className="p-10 text-center bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-4">Wymagana Integracja</h2>
          <p className="text-gray-500 mb-6">Połącz konto Allegro, aby móc dodawać nowe oferty bezpośrednio z systemu PIM.</p>
          <Link href="/dashboard/settings" className="bg-brand-orange text-white px-6 py-2 font-bold hover:bg-orange-600 transition-none">Ustawienia</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen bg-gray-50 text-[#222222]">
      
      <header className="mb-8 flex items-center gap-3 border-b border-gray-200 pb-6">
        <PackagePlus className="w-8 h-8 text-brand-orange" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Kreator Produktu (PIM)</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Stwórz nową ofertę i wyślij ją do Allegro jako szkic.</p>
        </div>
      </header>

      {success && (
        <div className="mb-8 bg-green-50 border border-green-200 p-6 flex flex-col items-center justify-center">
          <p className="text-green-700 font-bold text-lg mb-2">Sukces! Oferta została zapisana w Allegro jako SZKIC.</p>
          <p className="text-sm text-green-600">Za chwilę zostaniesz przeniesiony na pulpit...</p>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-600 p-4 font-bold text-sm">
          Błąd wystawiania: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Dane Podstawowe */}
        <div className="bg-white border border-gray-200 p-6 shadow-none">
          <h2 className="text-lg font-bold mb-6 border-b border-gray-100 pb-4">Dane Podstawowe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tytuł Oferty</label>
              <input 
                type="text" 
                required
                maxLength={50}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-orange rounded-none transition-none" 
                placeholder="Np. Słuchawki Bezprzewodowe Bluetooth 5.0" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cena (PLN)</label>
              <input 
                type="number" 
                step="0.01"
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-orange rounded-none transition-none" 
                placeholder="99.99" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dostępna Ilość (Sztuki)</label>
              <input 
                type="number" 
                min="1"
                required
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-orange rounded-none transition-none" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ID Kategorii Allegro</label>
              <input 
                type="text" 
                required
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand-orange bg-gray-50 rounded-none transition-none" 
                placeholder="Np. 257222 (pozostaw domyślne dla testów)" 
              />
              <p className="text-xs text-gray-400 mt-1">Docelowo tutaj pojawi się drzewo kategorii (Category Picker).</p>
            </div>
          </div>
        </div>

        {/* Galeria */}
        <div className="bg-white border border-gray-200 p-6 shadow-none">
          <h2 className="text-lg font-bold mb-6 border-b border-gray-100 pb-4">Galeria Zdjęć</h2>
          <div className="border-2 border-dashed border-gray-300 p-10 text-center hover:border-brand-orange transition-none cursor-pointer bg-gray-50">
            <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="font-bold text-sm text-gray-500">Przeciągnij zdjęcia lub kliknij, by wgrać</p>
            <p className="text-xs text-gray-400 mt-1">Opcja wgraj obrazki będzie aktywowana po integracji z Cloudinary/Supabase Storage.</p>
          </div>
        </div>

        {/* Akcje */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <Link href="/dashboard" className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 border border-transparent transition-none">Anuluj</Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 shadow-none transition-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Zapisywanie..." : "Wystaw na Allegro"}
          </button>
        </div>

      </form>
    </div>
  );
}
