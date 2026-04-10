-- Storage buckets for lesson videos and resources
-- Run in Supabase SQL Editor AFTER enabling Storage in your project settings

-- Lesson videos bucket (private — signed URLs only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-videos',
  'lesson-videos',
  false,
  524288000, -- 500 MB per file
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
) ON CONFLICT (id) DO NOTHING;

-- Resources bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lesson-resources',
  'lesson-resources',
  false,
  52428800, -- 50 MB per file
  ARRAY['application/pdf', 'application/zip', 'text/markdown', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS: only instructors/admins can upload
CREATE POLICY "Instructors can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lesson-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Instructors can upload resources" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lesson-resources' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );

-- All authenticated users can read (via signed URLs)
CREATE POLICY "Authenticated users can read videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lesson-videos' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can read resources" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lesson-resources' AND auth.uid() IS NOT NULL
  );

-- Instructors can delete their uploads
CREATE POLICY "Instructors can delete videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'lesson-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('instructor', 'admin')
    )
  );
