import type { ComponentProps } from 'react';

export const Table = ({ className = '', ...props }: ComponentProps<'table'>) => (
  <table {...props} className={`w-full table-auto ${className}`} />
);

export const TableHead = (props: ComponentProps<'thead'>) => {
  const { className = '', ...rest } = props;
  return <thead {...rest} className={`border-y-primary/10 bg-primary/2 border-y ${className}`} />;
};

export const TableBody = (props: ComponentProps<'tbody'>) => <tbody {...props} />;

export const TableRow = (props: ComponentProps<'tr'>) => {
  const { className = '', ...rest } = props;
  return <tr {...rest} className={`transition-colors duration-100 ${className}`} />;
};

export const TableHeadCell = ({ className = '', ...props }: ComponentProps<'th'>) => (
  <th
    {...props}
    className={`text-primary/55 w-auto px-4 py-3 text-center text-xs font-semibold whitespace-nowrap uppercase transition-colors duration-100 ${className}`}
  />
);

export const TableRowCell = ({ className = '', ...props }: ComponentProps<'td'>) => (
  <td
    {...props}
    className={`w-auto px-4 py-3 text-center align-middle text-sm whitespace-nowrap ${className}`}
  />
);
