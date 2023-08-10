import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';

export const SignUp = () => {
  const { user } = useAuth();

  return <>{user ? <Navigate to={'/'} replace={true} /> : <h2>Registration</h2>}</>;
};
