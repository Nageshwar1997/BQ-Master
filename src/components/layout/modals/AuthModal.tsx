import { useQueryParams } from '@beautinique/frontend-hooks';
import { useCallback, useEffect } from 'react';

import LoginForm from '../forms/LoginForm';
import { ModalWrapper } from './ModalWrapper';

const AuthModal = () => {
  const { queryParams, removeParams } = useQueryParams();

  const onClose = useCallback(() => {
    removeParams(['login'], { replace: true });
  }, [removeParams]);

  /*
   * Intentionally runs once on true mount only, to clear a stray leftover `?login=` param from a
   * previous session/reload - re-running this whenever `onClose` changes (e.g. on navigation)
   * would clear the login param while the user is actively using the modal.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onClose, []);

  return (
    <ModalWrapper isOpen={!!queryParams.login} onClose={onClose}>
      <LoginForm />
    </ModalWrapper>
  );
};

export default AuthModal;
