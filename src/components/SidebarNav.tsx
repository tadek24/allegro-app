"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, BarChart, MessageCircle, Box } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  // Hide nav on login page
  if (pathname === '/login') return null;

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-md z-50">
        <div className="flex justify-around items-center h-16 px-2">
          <NavItem href="/dashboard" icon={<Home />} label="Aukcje" isActive={pathname === '/dashboard'} isMobile />
          <NavItem href="/analysis" icon={<TrendingUp />} label="Analiza" isActive={pathname === '/analysis'} isMobile />
          <NavItem href="/ads" icon={<BarChart />} label="Ads" isActive={pathname === '/ads'} isMobile />
          <NavItem href="/messages" icon={<MessageCircle />} label="Wiadomości" isActive={pathname === '/messages'} isMobile />
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 p-6 z-50 transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-3 mb-10 text-brand-orange">
          <div className="bg-brand-orange/10 p-2 rounded-xl">
            <Box className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#222222]">E-Prom Allegro</span>
        </div>

        <nav className="flex flex-col gap-3">
          <NavItem href="/dashboard" icon={<Home />} label="Dashboard" isActive={pathname === '/dashboard'} />
          <NavItem href="/analysis" icon={<TrendingUp />} label="Analiza Konkurencji" isActive={pathname === '/analysis'} />
          <NavItem href="/ads" icon={<BarChart />} label="Kampanie Ads" isActive={pathname === '/ads'} />
          <NavItem href="/messages" icon={<MessageCircle />} label="Wiadomości" isActive={pathname === '/messages'} />
        </nav>

        <div className="mt-auto">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-[#222222] mb-1">Plan Pro</h4>
            <p className="text-xs text-gray-500 mb-3">Zyskujesz przewagę na rynku.</p>
            <button className="text-xs font-semibold text-brand-orange hover:text-orange-700 transition-colors w-full text-left">
              Zarządzaj subskrypcją &rarr;
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
      <Link href={href} className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-brand-orange scale-110' : 'text-gray-500 hover:text-brand-orange'}`}>
        <div className="w-6 h-6 mb-1">
          {icon}
        </div>
        <span className="text-[10px] font-semibold">{label}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-brand-orange text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-orange'}`}>
      <div className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-orange'}`}>
        {icon}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </Link>
  );
}
