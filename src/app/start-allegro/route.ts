import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const clientId = process.env.ALLEGRO_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'Brak konfiguracji ALLEGRO_CLIENT_ID' }, { status: 500 });
  }

  const redirectUri = 'https://allegro-app.vercel.app/api/auth/allegro/callback';
  const allegroAuthUrl = `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(allegroAuthUrl);
}