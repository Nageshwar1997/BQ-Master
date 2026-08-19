import type { IChildren, IClassName, IContainerClassName } from '@/types/component.type';

const BorderGradient = ({
  children,
  className = '',
  containerClassName = '',
}: IChildren & IClassName & IContainerClassName) => {
  return (
    <div className={`bg-border-gradient mx-auto w-full rounded-3xl p-px ${containerClassName}`}>
      <div
        className={`shadow-light-dark-soft bg-platinum-black base:p-6 rounded-[23px] p-4 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGradient;
