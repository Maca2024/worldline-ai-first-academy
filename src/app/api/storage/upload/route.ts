import { NextResponse } from 'next/server';
import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';

const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

type BucketId = 'lesson-videos' | 'lesson-resources';

const ALLOWED_BUCKETS: BucketId[] = ['lesson-videos', 'lesson-resources'];

/**
 * POST /api/storage/upload
 * Generates a signed upload URL for instructors.
 * Body: { bucket: 'lesson-videos' | 'lesson-resources', path: string }
 *
 * Returns: { signedUrl, token, path }
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  // Only instructors and admins can upload
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['instructor', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Geen toegang. Alleen instructors kunnen bestanden uploaden.' }, { status: 403 });
  }

  let bucket: BucketId;
  let filePath: string;

  try {
    const body = await request.json();
    bucket = body.bucket as BucketId;
    filePath = typeof body.path === 'string' ? body.path.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: `Ongeldige bucket. Gebruik: ${ALLOWED_BUCKETS.join(', ')}` }, { status: 400 });
  }

  if (!filePath || filePath.includes('..') || filePath.startsWith('/')) {
    return NextResponse.json({ error: 'Ongeldig bestandspad.' }, { status: 400 });
  }

  const serviceClient = createServiceRoleClient();

  const { data, error } = await serviceClient.storage
    .from(bucket)
    .createSignedUploadUrl(filePath);

  if (error || !data) {
    console.error('Storage signed upload URL error:', error);
    return NextResponse.json({ error: 'Upload URL genereren mislukt.' }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  });
}

/**
 * GET /api/storage/upload?bucket=lesson-videos&path=week-1/intro.mp4
 * Returns a signed download URL for authenticated users.
 */
export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bucket = searchParams.get('bucket') as BucketId | null;
  const filePath = searchParams.get('path');

  if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: 'Ongeldige bucket.' }, { status: 400 });
  }

  if (!filePath) {
    return NextResponse.json({ error: 'path is verplicht.' }, { status: 400 });
  }

  const serviceClient = createServiceRoleClient();

  const { data, error } = await serviceClient.storage
    .from(bucket)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) {
    return NextResponse.json({ error: 'Download URL genereren mislukt.' }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl, expiresIn: SIGNED_URL_EXPIRY_SECONDS });
}
