import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'Brak kodu autoryzacyjnego' }, { status: 400 });
  }

  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
  const redirectUri = 'https://allegro-app.vercel.app/api/auth/allegro/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Błąd konfiguracji kluczy Allegro' }, { status: 500 });
  }

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch('https://allegro.pl/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      // Pokazujemy błąd bezpośrednio na ekranie
      return NextResponse.json({ error: 'Błąd wymiany tokenu w Allegro API', details: errorText }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Weryfikacja czy użytkownik na pewno istnieje w momencie powrotu
    if (userError || !user) {
      return NextResponse.json({ error: 'Zgubiono sesję użytkownika. Zaloguj się ponownie.', details: userError }, { status: 401 });
    }

    // Zapis do bazy z weryfikacją błędu
    const { error: dbError } = await supabase
      .from('allegro_integrations')
      .upsert({ 
        user_id: user.id, 
        access_token: tokenData.access_token, 
        refresh_token: tokenData.refresh_token 
      });

    // Jeśli baza danych odrzuci zapis, zatrzymujemy proces
    if (dbError) {
      return NextResponse.json({ error: 'Błąd zapisu tokenu w bazie Supabase', details: dbError }, { status: 500 });
    }

    // Tylko jeśli wszystko powyżej poszło idealnie, idziemy do sukcesu
    return NextResponse.redirect(new URL('/dashboard?integration=success', request.url));
    
  } catch (err: any) {
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera', details: err.message }, { status: 500 });
  }
}