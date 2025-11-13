import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://example.com/api/auth/callback';
  const scope = encodeURIComponent('https://www.googleapis.com/auth/youtube.upload');
  const state = 'demo-state';

  const url = clientId
    ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&access_type=offline&prompt=consent&scope=${scope}&state=${state}`
    : 'https://developers.google.com/youtube/v3/guides/uploading_a_video';

  return NextResponse.json({ url });
}
