import { useLocation, useNavigate, useParams } from 'react-router-dom';

const usePathParams = () => {
  const navigate = useNavigate();
  const pathParams = useParams();
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path !== '');

  return { pathParams, location, ...location, paths, navigate };
};

export default usePathParams;
