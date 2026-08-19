import { useEffect, useRef } from 'react';

import type { IClassName } from '@/types/component.type';

export const QuillContent = ({ content, className = '' }: IClassName & { content: string }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (element && content) {
      element.innerHTML = content;
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`prose md:prose-sm lg:prose-md xl:prose-lg 2xl:prose-xl custom-prose prose-headings:text-primary prose-headings:font-semibold prose-headings:my-3! prose-p:text-secondary prose-p:my-2! prose-p:leading-normal prose-a:text-fill-transparent prose-a:bg-accent-duo prose-strong:text-primary prose-em:text-secondary prose-ul:list-disc prose-ul:list-inside prose-ol:list-decimal prose-ol:list-inside prose-li:text-tertiary prose-li:my-1 prose-img:rounded-lg prose-img:w-full prose-img:h-full prose-img:object-contain prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:bg-primary/10 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-secondary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-sm prose-code:font-mono prose-code:text-primary-invert prose-pre:bg-primary-invert prose-pre:text-primary prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-table:table-auto prose-table:border-collapse prose-th:border-b prose-th:border-primary/30 prose-th:px-2 prose-th:py-1 prose-td:border-b prose-td:border-primary/30 prose-td:px-2 prose-td:py-1 w-full max-w-none cursor-default ${className} `}
    />
  );
};
