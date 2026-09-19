import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Determine extension and mime type
    let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    // Clean extension
    ext = ext.replace(/[^a-z0-9]/g, '');
    if (!ext) ext = 'jpg';

    const mimeType = file.type || `image/${ext === 'svg' ? 'svg+xml' : ext}`;
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeBaseName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const fileName = `products/${safeBaseName}_${timestamp}_${randomStr}.${ext}`;
    const localFileName = `${safeBaseName}_${timestamp}_${randomStr}.${ext}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. First attempt: Upload to Supabase Storage if configured
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your_supabase')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false }
        });

        // Check or attempt to create bucket if needed
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          if (urlData?.publicUrl) {
            return NextResponse.json({
              url: urlData.publicUrl,
              storage: 'supabase',
              fileName
            });
          }
        } else {
          console.warn('Supabase storage upload returned error, attempting bucket creation or fallback:', uploadError.message);
          
          // Try to create bucket if bucket not found
          if (uploadError.message?.toLowerCase().includes('bucket not found')) {
            const { error: createErr } = await supabase.storage.createBucket('product-images', { public: true });
            if (!createErr) {
              const { error: retryErr } = await supabase.storage
                .from('product-images')
                .upload(fileName, buffer, {
                  contentType: mimeType,
                  upsert: true,
                });
              if (!retryErr) {
                const { data: retryUrl } = supabase.storage
                  .from('product-images')
                  .getPublicUrl(fileName);
                if (retryUrl?.publicUrl) {
                  return NextResponse.json({
                    url: retryUrl.publicUrl,
                    storage: 'supabase',
                    fileName
                  });
                }
              }
            }
          }
        }
      } catch (sbErr: any) {
        console.warn('Supabase Storage attempt failed, transitioning to fallback:', sbErr?.message);
      }
    }

    // 2. Second attempt: Write to public/uploads/products/ (Works in Node / local dev / self-hosted environments)
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      const localFilePath = path.join(publicUploadsDir, localFileName);
      fs.writeFileSync(localFilePath, buffer);
      
      return NextResponse.json({
        url: `/uploads/products/${localFileName}`,
        storage: 'local',
        fileName: localFileName
      });
    } catch (fsErr) {
      console.warn('Filesystem write not supported or read-only (e.g. Vercel serverless):', fsErr);
    }

    // 3. Third attempt: Vercel serverless / universal fallback — Base64 Data URL
    // Postgres TEXT supports up to 1GB, works directly in any browser and on Vercel without storage buckets
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      storage: 'base64',
      fileName: localFileName
    });

  } catch (error: any) {
    console.error('Fatal upload error:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
