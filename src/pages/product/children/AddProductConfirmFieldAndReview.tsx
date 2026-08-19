import type {
  TConfirmDetailsZodSchema,
  TDraftProductDetailsZodSchema,
} from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import MediaCarouselWithModal from '@/components/layout/carousels/MediaCarouselWithModal';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/inputs/Checkbox';
import { QuillContent } from '@/components/ui/QuillContent';
import type { TAddProductStepNumber } from '@/types/common.type';
import type { IClassName } from '@/types/component.type';
import { formatINRCurrency } from '@/utils/common.util';

interface Props {
  form: UseFormReturn<TConfirmDetailsZodSchema>;
  values: TDraftProductDetailsZodSchema;
  onEdit: (step: TAddProductStepNumber) => void;
}

const Heading = ({ title, onEdit }: { title: string; onEdit: () => void }) => (
  <div className="text-primary flex items-center gap-2">
    <h4 className="font-semibold">{title}</h4>
    <Icon
      icon="solar:pen-2-linear"
      className="hover:text-blue-crayola-c cursor-pointer duration-200 hover:scale-110 [&>g]:stroke-2"
      role="button"
      onClick={onEdit}
    />
  </div>
);

const KeyValue = ({
  label,
  value,
  className = '',
}: { label: string; value: string | ReactNode } & IClassName) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-tertiary/70 text-xs font-medium tracking-tight uppercase">{label}</p>
      <div className="text-primary text-sm">{value}</div>
    </div>
  );
};

const BasicInfo = ({
  data: { step: _, ...data },
  onEdit,
}: {
  data: Props['values']['basicInfo'];
  onEdit: () => void;
}) => {
  if (!Object.keys(data).length) return null;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Basic Information" onEdit={onEdit} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        <KeyValue label="Title" value={data.title} />
        <KeyValue label="Brand" value={data.brand} />
        <KeyValue
          label="Selling Price"
          value={formatINRCurrency(data.sellingPrice)}
          className="[&>div]:text-primary-green"
        />
        <KeyValue label="Original Price" value={formatINRCurrency(data.originalPrice)} />
        <KeyValue label="Main Category" value={data.l1Category.name} />
        <KeyValue label="Sub-Category" value={data.l2Category.name} />
        <KeyValue label="Product Category" value={data.l3Category.name} />
      </div>
    </section>
  );
};

const DescriptionAndContent = ({
  data: { step: _, ...data },
  onEdit,
}: {
  data: Props['values']['descriptionAndContent'];
  onEdit: () => void;
}) => {
  if (!Object.keys(data).length) return null;
  const { shortDescription, ...restData } = data;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Description & Other Info" onEdit={onEdit} />
      <KeyValue label="Short description" value={shortDescription} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        {Object.entries(restData).map(([key, content]) => {
          if (!content) return null;
          return (
            <KeyValue
              key={key}
              label={key}
              value={<QuillContent content={content} className="lg:prose-sm!" />}
            />
          );
        })}
      </div>
    </section>
  );
};

const MediaAndGallery = ({
  data: { step: _, ...data },
  onEdit,
}: {
  data: Props['values']['mediaAndGallery'];
  onEdit: () => void;
}) => {
  if (!Object.keys(data).length) return null;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title="Media and Gallery" onEdit={onEdit} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        <KeyValue
          label="Thumbnail"
          value={
            <MediaCarouselWithModal
              media={[{ type: 'image', url: data.thumbnail as string }]}
              gradientClassNames={{ left: 'from-smoke-eerie', right: 'from-smoke-eerie' }}
            />
          }
        />
        <KeyValue
          label={data.images.length > 1 ? 'Images' : 'Image'}
          value={
            <MediaCarouselWithModal
              media={data.images.map((image) => ({ type: 'image', url: image as string }))}
              gradientClassNames={{ left: 'from-smoke-eerie', right: 'from-smoke-eerie' }}
            />
          }
        />
        {data.video && (
          <KeyValue
            label="Video"
            value={
              <MediaCarouselWithModal
                media={[{ type: 'video', url: data.video as string }]}
                gradientClassNames={{ left: 'from-smoke-eerie', right: 'from-smoke-eerie' }}
              />
            }
          />
        )}
      </div>
    </section>
  );
};

const StockAndVariants = ({
  data: { step: _, ...data },
  onEdit,
}: {
  data: Props['values']['stockAndVariants'];
  onEdit: () => void;
}) => {
  if (!Object.keys(data).length) return null;
  const { hasVariants } = data;

  const variants = hasVariants ? data.variants : undefined;
  const stocks = !hasVariants ? data : undefined;
  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <Heading title={hasVariants ? 'Variants' : 'Stock'} onEdit={onEdit} />
      {stocks && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
          <KeyValue label="Stock" value={stocks.stock} />
          <KeyValue label="Stock Threshold" value={stocks.stockThreshold} />
        </div>
      )}
      {variants?.map((variant, index) => (
        <div
          key={index}
          className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6"
        >
          {variant.thumbnail && (
            <KeyValue
              label="Thumbnail"
              value={
                <MediaCarouselWithModal
                  media={[{ type: 'image', url: variant.thumbnail as string }]}
                  gradientClassNames={{ left: 'from-smoke-eerie', right: 'from-smoke-eerie' }}
                />
              }
            />
          )}
          <KeyValue
            label={variant.images.length > 1 ? 'Images' : 'Image'}
            value={
              <MediaCarouselWithModal
                media={variant.images.map((image) => ({ type: 'image', url: image as string }))}
                gradientClassNames={{ left: 'from-smoke-eerie', right: 'from-smoke-eerie' }}
              />
            }
          />
          <KeyValue label="Label" value={variant.label} />
          <KeyValue
            label={variant.type === 'Color' ? 'Color' : 'Value'}
            value={
              variant.type === 'Color' ? (
                <div style={{ backgroundColor: variant.value }} className="w-fit px-5 py-2" />
              ) : (
                variant.value
              )
            }
          />
          <KeyValue label="Stock" value={variant.stock} />
          <KeyValue label="Stock Threshold" value={variant.stockThreshold} />
          <KeyValue
            label="Selling Price"
            value={formatINRCurrency(variant.sellingPrice)}
            className="[&>div]:text-primary-green"
          />
          <KeyValue label="Original Price" value={formatINRCurrency(variant.originalPrice)} />
        </div>
      ))}
    </section>
  );
};

const TryOnConfiguration = ({
  data: { step: _, ...data },
  onEdit,
}: {
  data: Props['values']['tryOnConfiguration'];
  onEdit: () => void;
}) => {
  if (!Object.keys(data).length || !data.tryOn?.category) return null;

  return (
    <section className="border-platinum-jet bg-smoke-eerie shadow-light-dark-soft flex flex-col gap-6 rounded-xl border p-6">
      <div className="flex items-center justify-between gap-4">
        <Heading title="Try-On" onEdit={onEdit} />
        <Button pattern="secondary" content="Try-On" className="w-fit! rounded-md py-2.5!" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,max-content))] gap-6">
        <KeyValue label="Category" value={data.tryOn.category} />
        <KeyValue label="Sub-Category" value={data.tryOn.subCategory} />
      </div>
    </section>
  );
};

const AddProductConfirmFieldAndReview = ({ values, form, onEdit }: Props) => {
  const {
    basicInfo,
    mediaAndGallery,
    descriptionAndContent,
    stockAndVariants,
    tryOnConfiguration,
  } = values;
  return (
    <div className="grid gap-4">
      <BasicInfo
        data={basicInfo}
        onEdit={() => {
          onEdit(0);
        }}
      />
      <MediaAndGallery
        data={mediaAndGallery}
        onEdit={() => {
          onEdit(1);
        }}
      />
      <DescriptionAndContent
        data={descriptionAndContent}
        onEdit={() => {
          onEdit(2);
        }}
      />
      <StockAndVariants
        data={stockAndVariants}
        onEdit={() => {
          onEdit(3);
        }}
      />
      <TryOnConfiguration
        data={tryOnConfiguration}
        onEdit={() => {
          onEdit(4);
        }}
      />
      <Checkbox
        register={form.register('confirm')}
        error={form.formState.errors.confirm?.message}
        content="I confirm the product details are correct"
        checkboxProps={{ name: 'confirm' }}
      />
    </div>
  );
};

export default AddProductConfirmFieldAndReview;
