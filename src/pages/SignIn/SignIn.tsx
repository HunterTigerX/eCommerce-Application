import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';
import { SignInInputForm } from '@widgets/SignInForm';
import './signIn.css';
export const SignIn = () => {
  const { user } = useAuth();
  return user ? (
    <Navigate to={'/'} replace={true} />
  ) : (
    <>
      <SignInInputForm />
    </>
  );
};
