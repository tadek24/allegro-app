import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    // TODO: Implementacja API ShipX (InPost)
    // 1. Pobranie danych paczki z request.json()
    // 2. Walidacja tokenów integracji InPost z bazy
    // 3. Wysłanie żądania do ShipX API
    // 4. Zapis nr paczki w bazie i odpowiedź

    return NextResponse.json({ message: "Integracja InPost w trakcie tworzenia" }, { status: 501 });
  } catch (error) {
    console.error("InPost error:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
