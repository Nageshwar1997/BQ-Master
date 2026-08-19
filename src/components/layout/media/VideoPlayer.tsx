import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

import { VIDEO_PLACEHOLDER } from '@/constants/common.constants';
import type { IVideoPlayer } from '@/types/component.type';
import { convertVideoToPoster } from '@/utils/common.util';

const VideoPlayer = ({
  className = '',
  videoProps,
  ref,
  showPosterOnly,
}: IVideoPlayer) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setVideoRef = (node: HTMLVideoElement | null) => {
    videoRef.current = node;

    if (ref) ref.current = node;
  };

  const [generatedPoster, setGeneratedPoster] = useState<string | undefined>(undefined);
  const poster = videoProps.poster ?? generatedPoster;

  useEffect(() => {
    let isMounted = true;

    const loadPoster = async () => {
      if (!videoProps.src || videoProps.poster) return;

      try {
        const generated = await convertVideoToPoster(videoProps.src);

        if (isMounted) {
          setGeneratedPoster(generated);
        }
      } catch (error) {
        console.error('Poster generation failed:', error);
      }
    };

    void loadPoster();

    return () => {
      isMounted = false;
    };
  }, [videoProps.src, videoProps.poster]);

  useEffect(() => {
    if (showPosterOnly) return;

    const video = videoRef.current;

    if (!video || !videoProps.src) return;

    let hls: Hls | null = null;

    const isHls = videoProps.src.endsWith('.m3u8');

    if (isHls) {
      video.pause();

      video.removeAttribute('src');
      video.load();

      if (Hls.isSupported()) {
        hls = new Hls();

        hls.loadSource(videoProps.src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoProps.autoPlay) {
            video.play().catch((err: unknown) => {
              console.warn('Autoplay blocked:', err);
            });
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoProps.src;

        video.addEventListener(
          'loadedmetadata',
          () => {
            if (videoProps.autoPlay) {
              video.play().catch((err: unknown) => {
                console.warn('Autoplay blocked:', err);
              });
            }
          },
          { once: true },
        );
      }
    }

    return () => {
      hls?.destroy();
    };
  }, [videoProps.src, videoProps.autoPlay, showPosterOnly]);

  return (
    <div className={`h-full w-full ${className}`}>
      {showPosterOnly ? (
        <img
          src={poster ?? VIDEO_PLACEHOLDER}
          alt="video-thumbnail"
          className={`aspect-auto h-full w-full object-cover ${videoProps.className ?? ''}`}
        />
      ) : (
        <video
          key={videoProps.src}
          ref={setVideoRef}
          {...videoProps}
          playsInline={videoProps.playsInline ?? true}
          autoPlay={videoProps.autoPlay ?? true}
          muted={videoProps.muted ?? true}
          loop={videoProps.loop ?? false}
          controls={videoProps.controls ?? false}
          className={`aspect-auto h-full w-full object-cover ${videoProps.className ?? ''}`}
          poster={poster}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
