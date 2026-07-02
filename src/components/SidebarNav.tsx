"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingCart, MessageCircle, Box, LogOut, Settings } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Ukryj nawigację na stronach autoryzacji
  if (pathname === '/login' || pathname?.startsWith('/auth')) {
    return null;
  }

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key"
    );
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-none z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <NavItem href="/dashboard" icon={<Home />} label="Pulpit" isActive={pathname === '/dashboard'} isMobile />
          <NavItem href="/dashboard/orders" icon={<ShoppingCart />} label="Zamówienia" isActive={pathname === '/dashboard/orders'} isMobile />
          <NavItem href="/messages" icon={<MessageCircle />} label="Wiadomości" isActive={pathname === '/messages'} isMobile />
          <NavItem href="/dashboard/settings" icon={<Settings />} label="Ustawienia" isActive={pathname === '/dashboard/settings'} isMobile />
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 p-6 z-50 shadow-none">
        <div className="flex items-center gap-3 mb-10 text-brand-orange">
          <div className="bg-orange-50 p-2 border border-brand-orange">
            <Box className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#222222]">E-Prom Allegro</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem href="/dashboard" icon={<Home />} label="Pulpit & Oferty" isActive={pathname === '/dashboard'} />
          <NavItem href="/dashboard/orders" icon={<ShoppingCart />} label="Zamówienia" isActive={pathname === '/dashboard/orders'} />
          <NavItem href="/messages" icon={<MessageCircle />} label="Wiadomości" isActive={pathname === '/messages'} />
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <div className="p-4 bg-gray-50 border border-gray-200">
            <h4 className="text-sm font-bold text-[#222222] mb-1">Plan Pro</h4>
            <p className="text-xs text-gray-500 mb-3">Zyskujesz przewagę na rynku.</p>
            <button className="text-xs font-semibold text-brand-orange hover:text-orange-700 transition-colors w-full text-left">
              Zarządzaj subskrypcją &rarr;
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-2 w-full p-3 bg-white border border-gray-200 text-gray-600 hover:text-brand-orange hover:bg-gray-50 transition-none font-semibold text-sm"
            >
              <Settings className="w-4 h-4" />
              Ustawienia Integracji
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full p-3 bg-white border border-gray-200 text-gray-600 hover:text-brand-orange hover:bg-gray-50 transition-none font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Wyloguj się
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({ href, icon, label, isActive, isMobile = false }: { href: string; icon: React.ReactNode; label: string; isActive: boolean; isMobile?: boolean }) {
  if (isMobile) {
    return (
      <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-none ${isActive ? 'text-brand-orange' : 'text-gray-500 hover:text-brand-orange'}`}>
        <div className="w-6 h-6 mb-1">
          {icon}
        </div>
        <span className="text-[10px] font-semibold">{label}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-none transition-none group border ${isActive ? 'bg-orange-50 text-brand-orange border-brand-orange' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-orange border-transparent'}`}>
      <div className={`w-5 h-5 ${isActive ? 'text-brand-orange' : 'text-gray-400 group-hover:text-brand-orange'}`}>
        {icon}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </Link>
  );
}
