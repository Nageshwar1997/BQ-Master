import { Outlet } from 'react-router-dom';

import Footer from '@/components/layout/footer';
import AuthModal from '@/components/layout/modals/AuthModal';
import Sidebar from '@/components/layout/sidebar';
import ScrollToTop from '@/components/ScrollToTop';
import useAuthLogoutListener from '@/hooks/useAuthLogoutListener';
import useAutoRefreshAccessToken from '@/hooks/useAutoRefreshAccessToken';
import useAutoRetry from '@/hooks/useAutoRetry';

const Layout = () => {
  useAutoRetry(); // It will call api to refresh token when user is online again
  useAutoRefreshAccessToken(); // Proactively refreshes the access token every ~13 min while logged in
  useAuthLogoutListener(); // Clears user state and redirects to /auth when the session ends
  return (
    <div id="main" className="flex min-h-full w-full flex-col">
      <ScrollToTop />
      {/* If the user isn't logged in, show the auth modal. just add queryParams.login = "true" to the url */}
      <AuthModal />
      <div className="flex w-full grow flex-col-reverse md:flex-row">
        <Sidebar />
        <div className="h-full max-w-full min-w-0 flex-1 grow">
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      {/* <Chatbot /> */}
    </div>
  );
};

export default Layout;
