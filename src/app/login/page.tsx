"use client";

import { useState } from "react";
import { ArrowRight, Box, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key"
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setErrorMsg("Błędny e-mail lub hasło. Spróbuj ponownie.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setErrorMsg("Ten adres e-mail jest już zajęty lub hasło jest za słabe.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Left panel - Graphic/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-brand-orange p-12 text-white">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[url('https://placehold.co/1000x1000?text=Pattern')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Box className="w-8 h-8" />
            </div>
            <span className="font-bold text-2xl tracking-tight">E-Prom Allegro</span>
          </div>
          
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Zarządzaj sprzedażą<br />jak ekspert.
            </h1>
            <p className="text-xl text-white/90 max-w-md font-medium leading-relaxed">
              Zintegruj wszystkie swoje konta, analizuj konkurencję i maksymalizuj zyski z jednego miejsca.
            </p>
          </div>
          
          <div className="text-sm font-medium text-white/80">
            © 2026 E-Prom Allegro
          </div>
        </div>
      </div>

      {/* Right panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-md border border-gray-100">
          
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="bg-brand-orange text-white p-2 rounded-xl">
              <Box className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#222222]">E-Prom Allegro</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#222222] mb-2">
            {isLogin ? 'Witaj ponownie' : 'Rozpocznij'}
          </h2>
          <p className="text-gray-500 mb-8 font-medium">
            {isLogin ? 'Zaloguj się do swojego panelu zarządzania.' : 'Załóż konto, by zintegrować swoje sklepy.'}
          </p>

          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-1.5">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[#222222] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#222222] mb-1.5">Hasło</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[#222222] focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className="text-red-500 text-sm font-semibold mt-2">
                {errorMsg}
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-sm font-semibold text-brand-orange hover:text-orange-700">Zapomniałeś hasła?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Zaloguj się' : 'Stwórz konto'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-600">
            {isLogin ? "Nie masz konta? " : "Masz już konto? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-orange hover:text-orange-700 font-bold"
            >
              {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
