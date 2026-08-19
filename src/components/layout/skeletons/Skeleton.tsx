const Skeleton = ({ className = '' }) => {
  return <div className={`bg-primary/50 size-full animate-pulse rounded-xs ${className}`} />;
};

export default Skeleton;
