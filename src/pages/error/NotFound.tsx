import ErrorWrapper from './Errors';

const NotFound = () => {
  return (
    <ErrorWrapper
      imgText="404"
      title="Not Found"
      message="Sorry, the page you are looking for does not exist."
    />
  );
};

export default NotFound;
