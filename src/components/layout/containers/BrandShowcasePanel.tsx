import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';

interface IShowcaseHighlight {
  icon: string;
  text: string;
}

interface IBrandShowcasePanel {
  title: ReactNode;
  description: ReactNode;
  image: { src: string; alt: string };
  highlights: readonly IShowcaseHighlight[];
  className?: string;
  imageClassName?: string;
}

// The gradient "brand showcase" panel shared by the split-screen auth layout and the
// profile password page — brand/contextual copy, an illustration, and a row of trust pills.
const BrandShowcasePanel = ({
  title,
  description,
  image,
  highlights,
  className = '',
  imageClassName = '',
}: IBrandShowcasePanel) => {
  return (
    <div
      className={`from-blue-crayola-c via-dodger-blue-c hidden w-full rounded-2xl bg-linear-90 to-transparent lg:flex lg:flex-col lg:items-center lg:justify-between lg:gap-6 p-5 ${className}`}
    >
      {/* -------- Copy -------- */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-wide text-white sm:text-3xl">{title}</h1>
        <p className="max-w-sm text-sm text-white/80 sm:text-base">{description}</p>
      </div>

      {/* -------- Illustration -------- */}
      <img
        src={image.src}
        alt={image.alt}
        loading="eager"
        fetchPriority="high"
        className={`w-auto object-contain drop-shadow-2xl h-full ${imageClassName}`}
      />

      {/* -------- Trust Highlights -------- */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {highlights.map((item) => (
          <span
            key={item.text}
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md sm:text-sm"
          >
            <Icon icon={item.icon} className="size-4 shrink-0" />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BrandShowcasePanel;
