import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Allowed MIME types and their magic bytes (first bytes of file)
const ALLOWED_TYPES: Record<string, { mime: string; magic: number[] | null }> = {
  'image/jpeg': { mime: 'image/jpeg', magic: [0xFF, 0xD8, 0xFF] },
  'image/png':  { mime: 'image/png',  magic: [0x89, 0x50, 0x4E, 0x47] },
  'application/pdf': { mime: 'application/pdf', magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
};

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function checkMagicBytes(buffer: Buffer, magic: number[]): boolean {
  if (buffer.length < magic.length) return false;
  return magic.every((byte, i) => buffer[i] === byte);
}

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    // Clean up expired entries to prevent memory leak
    if (rateLimitMap.size > 5000) {
      for (const [key, val] of rateLimitMap) {
        if (now > val.resetAt) rateLimitMap.delete(key);
      }
    }
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
  }

  // Auth check — read token from Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Verify token using anon client
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await anonClient.auth.getUser(token);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Use user's JWT for all storage/db operations so RLS policies work correctly
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null; // 'passport' or 'olevel'

  if (!file || !type || !['passport', 'olevel'].includes(type)) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // Size check
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: 'File too large. Max 5MB allowed.' }, { status: 400 });
  }

  // Read file bytes
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // MIME type check against declared type
  const allowedEntry = ALLOWED_TYPES[file.type];
  if (!allowedEntry) {
    return NextResponse.json({ message: 'Invalid file type. Only JPG, PNG, and PDF are allowed.' }, { status: 400 });
  }

  // Magic bytes validation — verify actual file content matches declared type
  if (allowedEntry.magic && !checkMagicBytes(buffer, allowedEntry.magic)) {
    return NextResponse.json({ message: 'File content does not match its type.' }, { status: 400 });
  }

  // Derive safe extension from MIME type (never trust the filename)
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
  };
  const ext = extMap[file.type];
  const path = `${user.id}/${type}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('student-documents')
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    console.error('[upload-document] Upload error:', uploadError);
    return NextResponse.json({ message: 'Upload failed', error: uploadError.message }, { status: 500 });
  }

  // Update application record
  const column = type === 'passport' ? 'passport_path' : 'olevel_path';
  const statusColumn = type === 'passport' ? 'passport_status' : 'olevel_status';
  const msgColumn = type === 'passport' ? 'passport_msg' : 'olevel_msg';

  const { data: appData } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (appData?.id) {
    await supabase.from('applications').update({
      [column]: path,
      [statusColumn]: 'pending',
      [msgColumn]: null,
      updated_at: new Date().toISOString(),
    }).eq('id', appData.id);
  }

  return NextResponse.json({ message: 'Upload successful', path });
  } catch (err: any) {
    console.error('[upload-document] Unhandled error:', err);
    return NextResponse.json({ message: err?.message || 'Internal server error' }, { status: 500 });
  }
}
