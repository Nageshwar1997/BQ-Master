import type { TProductDescriptionAndContentZodSchema } from '@beautinique/frontend-types';
import { Controller, type UseFormReturn } from 'react-hook-form';

import QuillInput from '@/components/ui/inputs/quillInput';
import Textarea from '@/components/ui/inputs/Textarea';
import { PRODUCT_DESCRIPTION_AND_CONTENT_INPUT_MAP_DATA } from '@/constants/input.constants';
import type { TProductQuillImageRefs, TProductQuillRefs } from '@/types/common.type';

interface Props {
  form: UseFormReturn<TProductDescriptionAndContentZodSchema>;
  imageRefs: TProductQuillImageRefs;
  quillRefs: TProductQuillRefs;
}

const AddProductDescriptionAndContentFields = ({ form, imageRefs, quillRefs }: Props) => {
  return (
    <div className="grid gap-4">
      {PRODUCT_DESCRIPTION_AND_CONTENT_INPUT_MAP_DATA.map(({ label, name, placeholder }) =>
        name === 'shortDescription' ? (
          <Textarea
            key={name}
            label={label}
            register={form.register(name)}
            error={form.formState.errors[name]?.message}
            textAreaProps={{ placeholder, name }}
          />
        ) : (
          <Controller
            key={name}
            control={form.control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <QuillInput
                label={label}
                ref={quillRefs[name]}
                imagesRef={imageRefs[name]}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                error={form.formState.errors[name]?.message}
              />
            )}
          />
        ),
      )}
    </div>
  );
};

export default AddProductDescriptionAndContentFields;
