import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants/common.constants';
import envs from '@/envs';

interface IError {
  imgText: string;
  title: string;
  message: string;
}

const ErrorWrapper = ({ imgText, title, message }: IError) => {
  const error = useRouteError();

  let devMessage = 'Something went wrong';

  if (isRouteErrorResponse(error)) {
    devMessage = error.statusText || String(error.data) || devMessage;
  } else if (error instanceof Error) {
    devMessage = error.message;
  }

  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center space-y-4 p-6 text-center">
      <h1
        className={`w-full max-w-lg bg-[url('/images/Oops.webp')] bg-cover bg-clip-text bg-center bg-no-repeat text-center text-7xl font-extrabold text-transparent italic md:text-8xl lg:text-9xl`}
      >
        {imgText}
      </h1>
      <h1 className="bg-silver-duo bg-clip-text text-2xl font-bold text-transparent md:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="text-tertiary">{message}</p>
      {envs.is_dev && !!error && (
        <pre className="bg-primary-50 max-w-sm rounded-lg p-2 text-sm text-wrap text-white">
          Error: {devMessage}
        </pre>
      )}
      <div className="flex items-center justify-center gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Link
            key={index}
            target={index === 0 ? '_blank' : '_self'}
            to={index === 0 ? 'mailto:beautinique.bq@gmail.com' : ROUTES.DASHBOARD}
          >
            <Button
              content={index === 0 ? 'Contact Us' : 'Home'}
              pattern={index === 0 ? 'secondary' : 'primary'}
              className="base:min-w-40 min-w-36 rounded-lg!"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ErrorWrapper;
