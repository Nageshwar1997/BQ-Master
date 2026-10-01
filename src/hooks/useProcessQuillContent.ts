import { useCallback } from 'react';
import type { FieldPathValue, FieldValues } from 'react-hook-form';

import { useUploadMultipleMedia } from '@/services/media-service/media.service.query';
import type { IProcessQuillContent } from '@/types/input.type';
import { toaster } from '@/utils/common.util';
import { sanitizeQuillHtml } from '@/utils/input.util';

const getQuillContent = (value: string) => {
  if (!value || value === '<p><br></p>') return undefined;

  // Sanitize once more right before this becomes the value persisted to the backend (and, for
  // whichever field editor this is, whatever other client eventually renders it) - see
  // `sanitizeQuillHtml`'s own comment for why this isn't redundant with `QuillContent`/
  // `QuillInput`'s own sanitization.
  return sanitizeQuillHtml(value);
};

export const useProcessQuillContent = <T extends FieldValues>() => {
  const { mutateAsync, isPending } = useUploadMultipleMedia();

  const processQuillContent = useCallback(
    async ({
      quillRef,
      imagesRef,
      setValue,
      field,
      folder,
      toasterInfo = {
        title: 'Please wait...',
        description: 'Uploading content files...',
      },
    }: IProcessQuillContent<T>) => {
      if (!quillRef.current) return '';

      const quill = quillRef.current;
      let content = quill.root.innerHTML;

      const images = imagesRef.current;
      const files = images.map(({ file }) => file).filter((file): file is File => Boolean(file));

      if (!files.length) {
        const finalContent = getQuillContent(content);

        setValue(field, finalContent as FieldPathValue<T, typeof field>);
        return finalContent;
      }

      const formData = new FormData();

      files.forEach((file) => {
        formData.append('files', file);
      });

      formData.append('folder', folder);

      const { data } = await mutateAsync({ data: formData, toasterInfo });

      const urls: string[] = data?.filter(Boolean) ?? [];

      if (urls.length !== files.length) {
        toaster.error({
          title: 'Upload failed',
          description: 'Some files could not be uploaded.',
        });

        throw new Error('File upload count mismatch');
      }

      images.forEach(({ blobUrl }, index) => {
        content = content.split(blobUrl).join(urls[index]);
      });

      quill.root.innerHTML = content;

      // Cleanup uploaded blobs
      images.forEach(({ blobUrl }) => {
        URL.revokeObjectURL(blobUrl);
      });

      imagesRef.current = [];

      const finalContent = getQuillContent(content);

      setValue(field, finalContent as FieldPathValue<T, typeof field>);

      return finalContent;
    },
    [mutateAsync],
  );

  return { processQuillContent, isPending };
};
