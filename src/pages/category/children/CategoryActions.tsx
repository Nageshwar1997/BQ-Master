import Button from '@/components/ui/Button';
import type { TCatTable } from '@/types/component.type';

const CategoryActions = ({ onDelete, onEdit, ...data }: TCatTable) => (
  <div className="inline-flex items-center justify-center gap-2">
    <Button
      content={{ icon: 'solar:pen-linear', className: 'size-4.5' }}
      pattern="outline"
      buttonProps={{
        onClick: (event) => {
          event.stopPropagation();
          onEdit(data);
        },
      }}
      className="border-primary/20 hover:border-blue-crayola-c/50 hover:text-blue-crayola-c size-9! p-0!"
    />
    <Button
      content={{ icon: 'solar:trash-bin-trash-linear', className: 'size-4.5' }}
      pattern="outline"
      buttonProps={{
        onClick: (event) => {
          event.stopPropagation();
          onDelete(data.category._id);
        },
      }}
      className="border-primary/20 hover:border-red-c/50 hover:text-red-c size-9! p-0!"
    />
  </div>
);

export default CategoryActions;
