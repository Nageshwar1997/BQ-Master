const LoadingText = ({ text = 'Loading', className = '' }) => {
  return (
    <div
      data-text={text}
      className={`loading-text after:text-primary/0 w-fit font-mono text-[3.5vmin] font-extrabold after:content-[attr(data-text)] ${className}`}
      style={{
        ['--loading-text-duration' as string]: `${String(Math.max(1, text.length * 0.08))}s`,
      }}
    />
  );
};

export default LoadingText;
