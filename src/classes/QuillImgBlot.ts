import { isNullOrUndefined } from '@beautinique/shared-utils';
import Quill from 'quill';

import type { IQuillImageBlot } from '@/types/input.type';

interface TQuillImageValue {
  src: string;
  alt?: string;
  id?: string;
}

// Extended Image Blot
const BaseImage = Quill.import('formats/image') as IQuillImageBlot;

class QuillImgBlot extends BaseImage {
  static create(value: string | TQuillImageValue) {
    const node = super.create(value) as HTMLImageElement;

    if (typeof value === 'string') {
      node.setAttribute('src', value);
    } else {
      node.setAttribute('src', value.src);

      node.setAttribute('alt', value.alt ?? 'Image');

      if (!isNullOrUndefined(value.id)) {
        node.setAttribute('data-image-id', value.id);
      }
    }

    return node;
  }

  static value(node: HTMLImageElement) {
    return {
      src: node.getAttribute('src'),
      alt: node.getAttribute('alt'),
      id: node.getAttribute('data-image-id'),
    };
  }

  static sanitize(url: string) {
    if (url.startsWith('blob:')) {
      return url;
    }

    const Link = Quill.import('formats/link') as { sanitize?: (url: string) => string } | undefined;

    return Link?.sanitize ? Link.sanitize(url) : url;
  }
}

export default QuillImgBlot;
