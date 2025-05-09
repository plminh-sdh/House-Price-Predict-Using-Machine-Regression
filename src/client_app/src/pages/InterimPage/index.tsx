import { clientPaths } from '@/features/client/enums/client-paths';
import { authPaths } from '@auth/enums/auth-paths';
import sessionService from '@auth/services/session.service';
import { Navigate } from 'react-router';

function InterimPage() {
  const currentUser = sessionService.getCurrentUser();
  if (!currentUser) return <Navigate to={authPaths.login} />;
  return <Navigate to={clientPaths.tool} />;
}

export default InterimPage;
