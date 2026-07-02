"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert, ArrowRight, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isLinked, setIsLinked] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const router = useRouter();
  const setIntegrated = useStore(state => state.setIntegrated);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key"
  );

  useEffect(() => {
    let isMounted = true;
    async function checkIntegration() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('allegro_integrations')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (isMounted) {
          setIsLinked(!!data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkIntegration();
    return () => { isMounted = false; };
  }, [supabase]);

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('allegro_integrations')
        .delete()
        .eq('user_id', user.id);

      setIsLinked(false);
      setIntegrated(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen">
      <header className="mb-10 mt-4 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight">Ustawienia Integracji</h1>
        <p className="text-base text-gray-500 font-medium mt-1">Zarządzaj swoimi połączeniami z kontami sprzedażowymi.</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-none p-6 md:p-8">
        <h2 className="text-xl font-bold text-[#222222] mb-6">Status połączenia Allegro</h2>
        
        {loading ? (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-semibold text-sm">Sprawdzanie statusu...</span>
          </div>
        ) : isLinked ? (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50 border border-gray-200 p-6 rounded-none">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-700 p-3 rounded-none border border-green-200">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#222222] text-lg">Konto Allegro połączone</h3>
                <p className="text-sm text-gray-500 font-medium">Aplikacja posiada aktywny token autoryzacyjny.</p>
              </div>
            </div>
            <button 
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-none transition-none disabled:opacity-50 w-full md:w-auto"
            >
              {disconnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              Odłącz konto
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-50 border border-gray-200 p-6 rounded-none">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 text-brand-orange p-3 rounded-none border border-orange-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-[#222222] text-lg">Brak połączenia</h3>
                <p className="text-sm text-gray-500 font-medium">Musisz zintegrować konto, aby pobierać oferty i wiadomości.</p>
              </div>
            </div>
            <a 
              href="/api/auth/allegro/login"
              className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-none transition-none w-full md:w-auto"
            >
              Zintegruj Konto <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
