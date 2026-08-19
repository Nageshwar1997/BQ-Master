const Badge = ({ content = '', className = '' }) => (
  <span
    className={`border-primary/10 bg-primary/5 text-primary inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
  >
    {content}
  </span>
);
export default Badge;
