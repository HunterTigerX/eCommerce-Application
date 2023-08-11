import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';
import { SignInForm } from '@widgets/SignInForm';

export const SignIn = () => {
  const { user } = useAuth();

  return <>{user ? <Navigate to={'/'} replace={true} /> : <SignInForm />}</>;
};
