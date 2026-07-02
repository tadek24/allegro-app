import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { AllegroAdapter } from '@/services/integrations/AllegroAdapter';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });
    }

    const adapter = new AllegroAdapter(supabase, user.id);
    const threadsResponse = await adapter.getMessagingThreads();

    // Przekształcamy wątki na płaski format UI z minimalnym mockowaniem snippetu (bo jest pobierany oddzielnie)
    const threads = (threadsResponse.threads || []).map((thread: any) => ({
      id: thread.id,
      buyer: thread.customer?.login || "Nieznany klient",
      lastMessage: "Kliknij, aby otworzyć wątek...", 
      unread: thread.read === false,
      isDifficult: false
    }));

    return NextResponse.json({ threads }, { status: 200 });
  } catch (error: any) {
    console.error('Wystąpił błąd pobierania wiadomości:', error);
    return NextResponse.json({ error: error.message || 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}
