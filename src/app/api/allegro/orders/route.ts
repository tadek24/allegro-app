import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const { data: integration } = await supabase
      .from('allegro_integrations')
      .select('access_token')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!integration || !integration.access_token) {
      return NextResponse.json({ error: "Brak integracji z Allegro" }, { status: 401 });
    }

    // TODO: Pobranie zamówień z Allegro API (checkout-forms)
    // 1. Fetch: https://api.allegro.pl/order/checkout-forms
    // 2. Użycie integracji access_token
    // 3. Mapowanie danych do spójnego interfejsu (id, kupujący, status, kwota)
    // 4. Ewentualny zapis pobranych zamówień do lokalnej bazy (jeśli potrzebne buforowanie)

    return NextResponse.json({ message: "Integracja Allegro Orders w trakcie tworzenia" }, { status: 501 });
  } catch (error) {
    console.error("Allegro orders error:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
