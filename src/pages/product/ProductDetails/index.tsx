import { Icon } from '@iconify/react';
import { useMemo } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import { MediaCarouselWithParentMedia } from '@/components/layout/carousels/MediaCarouselWithParentMedia';
import PageWrapper from '@/components/layout/containers/PageWrapper';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import Dropdown from '@/components/layout/dropdown';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/inputs/Select';
import { QuillContent } from '@/components/ui/QuillContent';
import { PRODUCT_STATUS_TRANSITIONS } from '@/constants/api.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetDashboardProductBySlug } from '@/services/product-service/product.service.query';
import type { TMediaOption } from '@/types/component.type';
import { formatDate, formatINRCurrency, isNullOrUndefined } from '@/utils/common.util';

const ProductDetails = () => {
  const { pathParams } = usePathParams();
  const { data: product, isLoading, isError } = useGetDashboardProductBySlug(pathParams.slug ?? '');
  const { queryParams, setParams, removeParams } = useQueryParams();

  const variant = useMemo(() => {
    if (!product) return null;
    return product.hasVariants
      ? product.variants.find((variant) => variant.sku === queryParams.v)
      : null;
  }, [product, queryParams.v]);

  const media = useMemo(() => {
    if (!product) return [];
    const medias: TMediaOption[] = [
      { url: product.thumbnail, type: 'image' as const },
      ...product.images.map((image) => ({ url: image, type: 'image' as const })),
    ];

    if (product.hasVariants) {
      product.variants.forEach((variant) => {
        if (variant.thumbnail) {
          medias.push({ url: variant.thumbnail, type: 'image' as const });
        }

        medias.push(...variant.images.map((image) => ({ url: image, type: 'image' as const })));
      });
    }

    if (product.video) {
      medias.push({ url: product.video, type: 'video' as const });
    }

    return medias;
  }, [product]);

  const selectedMediaIndex = useMemo(() => {
    if (!variant) {
      return 0;
    }

    const mediaUrl = variant.thumbnail ?? variant.images[0];

    if (!mediaUrl) {
      return 0;
    }

    const index = media.findIndex((item) => item.type === 'image' && item.url === mediaUrl);

    return index >= 0 ? index : 0;
  }, [media, variant]);

  const { discount, originalPrice, sellingPrice, stock } = useMemo(() => {
    if (!product) return { discount: 0, sellingPrice: 0, originalPrice: 0, stock: null };
    return {
      discount: variant?.discount ?? product.discount,
      sellingPrice: variant?.sellingPrice ?? product.sellingPrice,
      originalPrice: variant?.originalPrice ?? product.originalPrice,
      stock: product.hasVariants ? variant?.stock : 'stock' in product ? product.stock : null,
    };
  }, [product, variant]);

  return (
    <PageWrapper
      navbar={{
        components: [
          <Select
            key="status-select"
            options={
              product?.status
                ? PRODUCT_STATUS_TRANSITIONS[product.status].map((status) => ({
                    label: status.toLowerCase(),
                    value: status,
                  }))
                : []
            }
            selectProps={{
              value: product?.status ?? 'all',
              onChange: (value) => {
                if (!value || value === 'all') {
                  removeParams(['status', 'search']);
                } else if (value) {
                  if (value === 'draft') {
                    removeParams(['search']);
                  }
                  setParams({ status: value.toString() });
                }
              },
              placeholder: 'Update status',
              disabled: !product?.status || isLoading || isError,
            }}
            containerClassName="max-w-40! w-full"
          />,
        ],
      }}
      className="flex flex-col gap-8"
    >
      {!!product && !!Object.keys(product).length ? (
        <div className="grid flex-col items-start gap-6 lg:grid-cols-2">
          <div className="w-full lg:sticky lg:top-37">
            {/* LEFT SECTION */}
            <div className="relative w-full">
              <MediaCarouselWithParentMedia
                media={media}
                needButtonControls={false}
                selected={selectedMediaIndex}
              />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2">
                <span className="bg-razzle-dazzle-rose-c rounded-full px-2 pt-1 pb-0.5 text-sm">
                  -{discount.toFixed(Number.isInteger(discount) ? 0 : 2)}%
                </span>
              </div>
            </div>
          </div>
          {/* RIGHT SECTION */}
          <div className="flex w-full flex-col gap-6 lg:sticky lg:top-37">
            <div>
              <p className="text-tertiary mb-1 text-sm font-medium">{product.brand}</p>
              <h1 className="text-primary mb-2 text-3xl font-bold md:text-4xl">{product.title}</h1>
              <p className="text-secondary/80 text-base">{product.shortDescription}</p>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {Array(5).map((_, index) => {
                  const fillPercentage = Math.max(
                    0,
                    Math.min(100, (product.averageRating - index) * 100),
                  );

                  return (
                    <div key={index} className="relative size-5">
                      <Icon
                        icon="solar:star-linear"
                        className="text-silver-jet-2 absolute inset-0 size-5"
                      />

                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${String(fillPercentage)}%` }}
                      >
                        <Icon icon="solar:star-bold" className="text-primary-yellow size-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span className="text-secondary leading-none font-semibold">
                {product.averageRating}
              </span>
              <span className="text-tertiary text-sm">({product.totalReviews} reviews)</span>
            </div>
            {/* HISTORY */}
            {product.history && (
              <div className="bg-tertiary-invert/50 border-battleship-davys-gray/20 rounded-2xl border p-5">
                <div className="">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {product.history.approvedAt && (
                      <div>
                        <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                          Approved On
                        </p>
                        <p className="text-primary mt-1 font-semibold">
                          {formatDate(product.history.approvedAt)}
                        </p>
                      </div>
                    )}
                    {product.history.blockedAt && (
                      <div>
                        <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                          Blocked On
                        </p>
                        <p className="text-primary mt-1 font-semibold">
                          {formatDate(product.history.blockedAt)}
                        </p>
                      </div>
                    )}
                    {product.history.rejectedAt && (
                      <div>
                        <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                          Blocked On
                        </p>
                        <p className="text-primary mt-1 font-semibold">
                          {formatDate(product.history.rejectedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                  {!!product.history.rejectReason && (
                    <div className="mt-4">
                      <p className="text-primary-red text-sm font-semibold">Rejection Reason:</p>
                      <p className="text-tertiary text-[13px]">{product.history.rejectReason}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* DETAILS */}
            <div className="bg-tertiary-invert/50 border-battleship-davys-gray/20 rounded-2xl border p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                    Category
                  </p>
                  <p className="text-primary mt-1 font-semibold">{product.category.name}</p>
                </div>
                <div>
                  <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                    SKU
                  </p>
                  <p className="text-primary mt-1 font-semibold">{product.sku}</p>
                </div>

                <div>
                  <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                    Slug
                  </p>
                  <p className="text-primary mt-1 font-semibold break-all">{product.slug}</p>
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="bg-tertiary-invert/50 rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-razzle-dazzle-rose-c text-3xl font-bold">
                  {formatINRCurrency(sellingPrice)}
                </span>
                <span className="text-tertiary/60 text-xl line-through">
                  {formatINRCurrency(originalPrice)}
                </span>
              </div>
              <p className="text-jade-c mt-2 text-sm font-medium">
                Save {formatINRCurrency(originalPrice - sellingPrice)} (
                {discount.toFixed(Number.isInteger(discount) ? 0 : 2)}% off)
              </p>
            </div>
            {!isNullOrUndefined(stock) && (
              <div className="bg-tertiary-invert/50 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`shrink-0 rounded-full p-1 ${stock ? 'bg-jade-c/40' : 'bg-princeton-orange-c/40'}`}
                  >
                    <div
                      className={`rounded-full p-1 ${stock ? 'bg-jade-c' : 'bg-princeton-orange-c'}`}
                    />
                  </div>
                  <span className="text-secondary/70 leading-normal font-medium">
                    {stock ? `${String(stock)} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Try On */}
            <div className="bg-tertiary-invert/50 border-battleship-davys-gray/20 rounded-2xl border p-5">
              <div className="flex justify-between gap-4">
                <h4 className="font-semibold">Try On:</h4>
                <div>
                  <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                    Category
                  </p>
                  <p className="text-primary mt-1 font-semibold">
                    {product.tryOn.configured ? product.tryOn.category : 'Not Configured'}
                  </p>
                </div>
                <div>
                  <p className="text-silver-jet-2 text-xs font-medium tracking-wider uppercase">
                    Sub-category
                  </p>
                  <p className="text-primary mt-1 font-semibold">
                    {product.tryOn.configured ? product.tryOn.subCategory : 'Not Configured'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <Button content={product.tryOn.enabled ? 'Disable' : 'Enable'} pattern="tertiary" />
                <Button content="Configure" pattern="tertiary" />
              </div>
            </div>

            {/* Variants */}
            {product.hasVariants && product.variants.length > 0 && (
              <div className="space-y-2">
                {!!variant && (
                  <p className="text-sm">
                    <span className="font-semibold">Variant:</span> {variant.label}
                  </p>
                )}
                <ScrollableGradientContainer
                  direction="horizontal"
                  containerClassName="max-h-20"
                  className="[&>div]:justify-start"
                >
                  <div className="flex items-center gap-3">
                    {product.variants.map((v, index) => {
                      const isColor = v.type === 'Color';
                      const active = variant?.sku === v.sku;
                      return (
                        <div
                          key={`variant-${String(index)}`}
                          role="button"
                          tabIndex={0}
                          aria-pressed={active}
                          className={`cursor-pointer text-center text-[11px]/3.5 ${active ? 'text-tertiary' : 'text-tertiary/80'}`}
                          onClick={() => {
                            setParams({ v: v.sku });
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setParams({ v: v.sku });
                            }
                          }}
                        >
                          {isColor ? (
                            <div className={`flex flex-col items-center gap-1`}>
                              <div
                                className={`size-12 shrink-0 rounded-full border-2 ${active ? 'border-primary' : 'border-primary/30'}`}
                                style={{ backgroundColor: v.value }}
                              />
                              <p className="line-clamp-2 max-w-12 wrap-break-word">{v.label}</p>
                            </div>
                          ) : (
                            <div className={`flex flex-col items-center gap-1`}>
                              <div
                                className={`line-clamp-2 flex h-12 max-w-20 flex-col items-center justify-center rounded-md border-2 px-2 wrap-break-word ${active ? 'border-primary' : 'border-primary/30'}`}
                              >
                                {v.value}
                              </div>
                              <p className="line-clamp-2 max-w-20 wrap-break-word">{v.label}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollableGradientContainer>
              </div>
            )}

            <div className="flex gap-4 lg:gap-6">
              <Button
                content="Try-On"
                pattern="secondary"
                buttonProps={{ disabled: !product.tryOn.enabled }}
              />
              <Button content="Add Review" pattern="primary" />
            </div>
            <div className="space-y-4">
              {[
                { title: 'Description', content: product.description },
                { title: 'Usage instructions', content: product.instructions },
                { title: 'Ingredients', content: product.ingredients },
                { title: 'Additional Info', content: product.additional },
              ].map(({ content, title }, index) => {
                if (!content) return null;
                return (
                  <Dropdown
                    key={index}
                    title={title}
                    defaultOpen={index === 0}
                    className="[&>button]:border-y-primary/30 [&>button]:border-y"
                  >
                    <QuillContent content={content} />
                  </Dropdown>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <ApiStatus
          className="min-h-[80dvh]"
          status={isLoading ? 'loading' : isError ? 'error' : 'empty'}
          text={isLoading ? 'Loading Product...' : undefined}
          title={isError ? 'Failed to load product' : 'Product not found'}
          description={
            isError
              ? 'Something went wrong! Please try again.'
              : 'The requested product could not be found. Please try again.'
          }
        />
      )}
    </PageWrapper>
  );
};

export default ProductDetails;
