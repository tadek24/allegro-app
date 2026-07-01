import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'Brak kodu autoryzacyjnego' }, { status: 400 });
  }

  // Wymiana code na tokeny (MOCK)
  // const credentials = btoa(`${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`);
  // fetch('https://allegro.pl/auth/oauth/token', ...)
  
  const mockAccessToken = 'mock_access_token_' + Math.random().toString(36).substr(2, 9);
  const mockRefreshToken = 'mock_refresh_token_' + Math.random().toString(36).substr(2, 9);

  // Weryfikacja sesji w Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Zapisujemy powiązanie do bazy
    await supabase
      .from('allegro_integrations')
      .upsert({ 
        user_id: user.id, 
        access_token: mockAccessToken, 
        refresh_token: mockRefreshToken 
      });
  }

  // Niezależnie od faktycznego zapisu, przekierowujemy użytkownika do panelu
  const url = request.url;
  const redirectUrl = new URL('/dashboard', url);
  // Dodajemy flagę, by pokazać w UI, że integracja zakończyła się sukcesem (używamy tego do zasilenia stanu)
  redirectUrl.searchParams.set('integration', 'success');

  return NextResponse.redirect(redirectUrl);
}
