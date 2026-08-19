import { useCallback, useEffect } from 'react';

import type { IMediaCarouselWithParent } from '@/types/component.type';

import { MediaCarouselWithParentMedia } from '../carousels/MediaCarouselWithParentMedia';
import { ModalWrapper } from './ModalWrapper';

export const MediaModal = ({
  media,
  currentIndex,
  className = '',
  setCurrentIndex,
  opened,
  onClose,
  handleRemove,
  videoProps,
}: Pick<IMediaCarouselWithParent, 'media' | 'className' | 'handleRemove' | 'videoProps'> & {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  opened: boolean;
  onClose: (isOpen: boolean) => void;
}) => {
  const handleClose = useCallback(() => {
    onClose(false);
    setCurrentIndex(null);
  }, [onClose, setCurrentIndex]);

  useEffect(() => {
    if (media.length === 0) handleClose();
  }, [media.length, handleClose]);

  if (media.length === 0) return null;
  return (
    <ModalWrapper
      className="max-w-xl"
      isOpen={opened}
      onClose={handleClose}
      containerProps={{ className }}
      header={{ showCloseIcon: true }}
    >
      <MediaCarouselWithParentMedia
        handleRemove={handleRemove}
        media={media}
        needButtonControls={true}
        selected={currentIndex}
        videoProps={{
          ...videoProps,
          autoPlay: videoProps?.autoPlay ?? true,
          muted: videoProps?.muted ?? true,
          loop: videoProps?.loop ?? true,
          className: `object-contain! bg-primary/10 backdrop-blur-xs rounded-lg ${videoProps?.className ?? ''}`,
        }}
      />
    </ModalWrapper>
  );
};
