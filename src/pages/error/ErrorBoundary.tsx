import ErrorWrapper from './Errors';

const ErrorBoundary = () => {
  return (
    <ErrorWrapper
      imgText="Oops"
      title="Something went wrong."
      message="Seems like something is broken, hopefully it's not your heart!"
    />
  );
};

export default ErrorBoundary;
