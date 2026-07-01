"use client";

import { useState } from "react";
import { ArrowRight, Box } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    // Tutaj normalnie byłaby integracja z supabase.auth.signInWithPassword 
    // lub supabase.auth.signUp z użyciem klienta SSR (createBrowserClient)
    // na ten moment to makieta UI.
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen w-full flex bg-[#E4EFEB]">
      {/* Left panel - Graphic/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-brand-violet to-blue-600 p-12 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://placehold.co/1000x1000?text=Pattern')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Box className="w-8 h-8" />
            </div>
            <span className="font-bold text-2xl tracking-tight">AllegroManager</span>
          </div>
          
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Zarządzaj sprzedażą<br />jak ekspert.
            </h1>
            <p className="text-xl text-white/80 max-w-md font-medium leading-relaxed">
              Zintegruj wszystkie swoje konta, analizuj konkurencję i maksymalizuj zyski z jednego miejsca.
            </p>
          </div>
          
          <div className="text-sm font-medium text-white/60">
            © 2026 AllegroManager SaaS
          </div>
        </div>
      </div>

      {/* Right panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="bg-brand-violet text-white p-2 rounded-xl">
              <Box className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">AllegroManager</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? 'Witaj ponownie' : 'Rozpocznij'}
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            {isLogin ? 'Zaloguj się do swojego panelu zarządzania.' : 'Załóż konto, by zintegrować swoje sklepy.'}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-violet/50 focus:border-brand-violet transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hasło</label>
              <input 
                type="password" 
                required
                className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-violet/50 focus:border-brand-violet transition-all"
                placeholder="••••••••"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-semibold text-brand-violet hover:text-violet-700">Zapomniałeś hasła?</a>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-brand-violet hover:bg-violet-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_14px_0_rgba(139,92,246,0.39)]"
            >
              {isLogin ? 'Zaloguj się' : 'Stwórz konto'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-600">
            {isLogin ? "Nie masz konta? " : "Masz już konto? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-violet hover:text-violet-700 font-bold"
            >
              {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
