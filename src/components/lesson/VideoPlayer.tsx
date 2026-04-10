'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, Play } from 'lucide-react';

interface VideoPlayerProps {
  /** Storage path like 'week-1/intro.mp4' */
  storagePath: string;
  /** Optional title for accessibility */
  title?: string;
  className?: string;
}

type PlayerState = 'idle' | 'loading' | 'ready' | 'error';

export function VideoPlayer({ storagePath, title, className = '' }: VideoPlayerProps) {
  const [state, setState] = useState<PlayerState>('idle');
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchSignedUrl = async () => {
    setState('loading');
    try {
      const res = await fetch(
        `/api/storage/upload?bucket=lesson-videos&path=${encodeURIComponent(storagePath)}`
      );

      if (!res.ok) {
        setState('error');
        return;
      }

      const data = await res.json();
      setSignedUrl(data.signedUrl);
      setState('ready');
    } catch {
      setState('error');
    }
  };

  // Fetch URL on first play — not on mount (saves bandwidth for users who don't watch)
  const handlePlayIntent = () => {
    if (state === 'idle') {
      fetchSignedUrl();
    }
  };

  useEffect(() => {
    if (state === 'ready' && signedUrl && videoRef.current) {
      videoRef.current.play().catch(() => { /* autoplay may be blocked */ });
    }
  }, [state, signedUrl]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-navy-900 border border-white/5 aspect-video ${className}`}>
      {state === 'idle' && (
        <button
          onClick={handlePlayIntent}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white transition-colors group"
          aria-label={`Video afspelen: ${title ?? storagePath}`}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors flex items-center justify-center">
            <Play className="w-7 h-7 ml-1" />
          </div>
          <span className="text-sm">{title ?? 'Video afspelen'}</span>
        </button>
      )}

      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
        </div>
      )}

      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-accent-coral">
          <AlertCircle className="w-8 h-8" />
          <p className="text-sm">Video laden mislukt.</p>
          <button
            onClick={fetchSignedUrl}
            className="text-xs text-gray-400 hover:text-white underline"
          >
            Opnieuw proberen
          </button>
        </div>
      )}

      {state === 'ready' && signedUrl && (
        <video
          ref={videoRef}
          src={signedUrl}
          controls
          title={title}
          className="w-full h-full"
          preload="metadata"
        >
          Je browser ondersteunt geen video-afspelen.
        </video>
      )}
    </div>
  );
}
