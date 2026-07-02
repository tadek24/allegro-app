import { SupabaseClient } from "@supabase/supabase-js";

export async function getValidAllegroToken(supabase: SupabaseClient, userId: string): Promise<string | null> {
  // 1. Pobierz obecne tokeny z bazy
  const { data: integration, error } = await supabase
    .from('allegro_integrations')
    .select('access_token, refresh_token')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !integration) {
    console.error('Nie znaleziono integracji Allegro dla użytkownika:', userId);
    return null;
  }

  const { access_token, refresh_token } = integration;

  // 2. Weryfikacja access_token (Próbne uderzenie do serwera Allegro by sprawdzić ważność)
  // Allegro API zwraca 401 gdy access token wygasa (żyje 12h)
  try {
    const testResponse = await fetch('https://api.allegro.pl/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/vnd.allegro.public.v1+json'
      }
    });

    if (testResponse.ok) {
      return access_token; // Token jest nadal ważny
    }

    if (testResponse.status === 401) {
      console.log('Token Allegro wygasł. Rozpoczynam odświeżanie (refresh_token)...');
      
      const clientId = process.env.ALLEGRO_CLIENT_ID;
      const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        throw new Error('Brak konfiguracji kluczy Allegro na serwerze.');
      }

      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const refreshResponse = await fetch('https://allegro.pl/auth/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
          redirect_uri: 'https://allegro-app.vercel.app/api/auth/allegro/callback'
        }).toString()
      });

      if (!refreshResponse.ok) {
        throw new Error('Nie udało się odświeżyć tokena Allegro z użyciem refresh_token.');
      }

      const tokenData = await refreshResponse.json();

      // 3. Zapisz nowy token w bazie nadpisując stary
      await supabase
        .from('allegro_integrations')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token
        })
        .eq('user_id', userId);

      console.log('Pomyślnie odświeżono token Allegro dla użytkownika:', userId);
      return tokenData.access_token;
    }

    return null;
  } catch (error) {
    console.error('Błąd podczas weryfikacji/odświeżania tokena Allegro:', error);
    return null;
  }
}
