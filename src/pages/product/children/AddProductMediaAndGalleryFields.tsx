import { EMPTY_ARRAY, VIDEO_MIMES } from '@beautinique/frontend-constants';
import type { TProductMediaAndGalleryZodSchema } from '@beautinique/frontend-types';
import { Controller, type UseFormReturn, useWatch } from 'react-hook-form';

import FileInput from '@/components/ui/inputs/FileInput';
import { PRODUCT_MEDIA_AND_GALLERY_INPUT_MAP_DATA } from '@/constants/input.constants';
import { toErrorMessageArray } from '@/utils/form.util';

interface Props {
  form: UseFormReturn<TProductMediaAndGalleryZodSchema>;
}

const AddProductMediaAndGalleryFields = ({ form }: Props) => {
  const images = useWatch({ control: form.control, name: 'images', defaultValue: EMPTY_ARRAY });
  const values = useWatch({ control: form.control });

  return (
    <div className="grid grid-cols-2 gap-4">
      {PRODUCT_MEDIA_AND_GALLERY_INPUT_MAP_DATA.map((input) => {
        const { name, label, placeholder1, placeholder2 } = input;

        const isVideo = name === 'video';
        const isImages = name === 'images';

        const value = values[name];
        const hasValue = Array.isArray(value) ? value.length > 0 : !!value;
        const placeholder = hasValue ? placeholder2 : placeholder1;

        return (
          <Controller
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FileInput
                label={label}
                fileInputProps={{
                  name,
                  placeholder,
                  multiple: isImages,
                  accept: isVideo ? VIDEO_MIMES.join(',') : undefined,
                  disabled: isImages && images.length >= 10,
                  value,
                  onChange: ({ target: { files } }) => {
                    if (!files?.length) return;
                    if (isImages) {
                      const oldFiles = images;
                      field.onChange([...oldFiles, ...Array.from(files)]);
                    } else {
                      field.onChange(files[0]);
                    }
                  },
                }}
                errors={toErrorMessageArray<TProductMediaAndGalleryZodSchema>(
                  form.formState.errors[name],
                )}
                handleRemove={(index) => {
                  const nextValue = isImages
                    ? images.filter((_, currentIndex) => currentIndex !== index)
                    : undefined;

                  form.setValue(name, nextValue, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                containerClassName={isImages ? 'col-span-2' : ''}
              />
            )}
          />
        );
      })}
    </div>
  );
};
export default AddProductMediaAndGalleryFields;
