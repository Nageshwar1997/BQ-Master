import { isNullOrUndefined } from '@beautinique/shared-utils';
import { Icon } from '@iconify/react';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';

import Divider from '@/components/ui/Divider';
import type { IClassName, IMediaCarouselWithParent } from '@/types/component.type';

import MediaCarousel from './MediaCarousel';

// hls.js (used for real video playback) is only needed when a video is actually present in the
// media list - lazy-loading keeps it out of every page's initial bundle, including image-only ones.
const VideoPlayer = lazy(() => import('../media/VideoPlayer'));

const ChevronButton = ({ onClick, className = '' }: { onClick: () => void } & IClassName) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-primary/50 bg-primary-invert/50 cursor-pointer rounded-md border p-1.25 ${className}`}
    >
      <Icon icon="solar:alt-arrow-left-linear" className="text-primary" />
    </button>
  );
};

export const MediaCarouselWithParentMedia = ({
  className = '',
  media,
  selected = 0,
  needButtonControls = true,
  videoProps,
  handleRemove,
}: IMediaCarouselWithParent) => {
  const [currentIndex, setCurrentIndex] = useState(selected ?? 0);
  const [prevSelected, setPrevSelected] = useState(selected);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!isNullOrUndefined(selected) && selected !== prevSelected) {
    setPrevSelected(selected);
    setCurrentIndex(selected);
  }

  const mediaType = media[currentIndex]?.type ?? 'image';

  const src = useMemo(() => {
    if (currentIndex >= media.length) {
      return media[media.length - 1]?.url ?? '';
    } else if (media[currentIndex]) {
      return media[currentIndex].url;
    }
    return '';
  }, [currentIndex, media]);

  const handleIndexChange = (btnDir: 'prev' | 'next') => {
    if (btnDir === 'prev') {
      setCurrentIndex((prevIdx) => (currentIndex > 0 ? prevIdx - 1 : media.length - 1));
    } else {
      setCurrentIndex((prevIdx) => (currentIndex < media.length - 1 ? prevIdx + 1 : 0));
    }
  };

  useEffect(() => {
    if (isNullOrUndefined(selected)) return;
    // Scroll the selected thumbnail into view
    const el = thumbnailRefs.current[selected];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selected]);

  if (media.length === 0) return null;

  return (
    <div
      className={`bg-primary-invert flex w-full flex-col gap-4 overflow-hidden rounded-lg ${className}`}
    >
      {/* Main Image */}
      <div className="relative flex h-100 items-center justify-center lg:h-105 xl:h-125">
        <div className="flex h-full w-full transform items-center justify-center rounded-lg transition-opacity duration-500">
          {mediaType === 'video' ? (
            <Suspense fallback={null}>
              <VideoPlayer
                key={src}
                videoProps={{ ...videoProps, src }}
                className="mx-auto flex max-h-full items-center justify-center"
              />
            </Suspense>
          ) : (
            <img
              src={src}
              alt={`preview-${String(currentIndex)}`}
              className="mx-auto h-full max-h-full w-full object-contain"
              loading="lazy"
            />
          )}
        </div>

        {needButtonControls && media.length > 1 && (
          <div className="absolute bottom-0 flex w-full items-center justify-center gap-5 py-2 text-center text-sm">
            <ChevronButton
              onClick={() => {
                handleIndexChange('prev');
              }}
            />
            <span className="border-primary/50 bg-primary-invert/50 text-primary min-h-full w-24 content-center rounded-md border px-4 py-2 leading-none">
              {currentIndex + 1} of {media.length}
            </span>
            <ChevronButton
              onClick={() => {
                handleIndexChange('next');
              }}
              className="[&>svg]:rotate-180"
            />
          </div>
        )}
      </div>
      {/* Thumbnails */}
      {media.length > 1 && (
        <>
          <Divider />
          <MediaCarousel
            media={media}
            selected={currentIndex}
            onClick={setCurrentIndex}
            handleRemove={handleRemove}
            thumbnailRefs={thumbnailRefs}
          />
        </>
      )}
    </div>
  );
};
