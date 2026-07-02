import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    // TODO: Implementacja API Fakturowni
    // 1. Pobranie danych zamówienia z request.json()
    // 2. Pobranie klucza API Fakturowni dla danego usera z bazy
    // 3. Wysłanie POST do Fakturowni (tworzenie faktury)
    // 4. Zwrócenie URL do pobrania faktury

    return NextResponse.json({ message: "Integracja Fakturownia w trakcie tworzenia" }, { status: 501 });
  } catch (error) {
    console.error("Fakturownia error:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
