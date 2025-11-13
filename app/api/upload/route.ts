import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // NOTE: This is a stub queue endpoint. It doesn't persist on Vercel FS.
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ message: 'Invalid content type' }, { status: 400 });
    }

    const formData = await request.formData();
    const title = String(formData.get('title') || '');
    const description = String(formData.get('description') || '');
    const tags = String(formData.get('tags') || '');
    const privacy = String(formData.get('privacy') || 'private');
    const schedule = String(formData.get('schedule') || '');
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'Missing file' }, { status: 400 });
    }

    // Simulate enqueue
    const jobId = `job_${Date.now()}`;

    // In a real implementation, store to durable queue and start a background job
    // to call YouTube Data API v3 using OAuth2 access token with refresh token.

    return NextResponse.json({
      message: 'Queued upload (demo stub). Configure OAuth to enable real uploads.',
      jobId,
      metadata: { title, description, tags, privacy, schedule, fileName: file.name, size: file.size },
    });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
