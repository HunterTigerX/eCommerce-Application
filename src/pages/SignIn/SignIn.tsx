import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';
import { SignInInputForm  } from '@widgets/SignInForm';

export const SignIn = () => {
  const { user } = useAuth();
  // console.log('user', user);

  // user при перезагрузке становится null, и тогда открывает страницу с логином
  return <>{user ? <Navigate to={'/'} replace={true} /> : <SignInInputForm />}</>;

  return <>{user ? <Navigate to={'/'} replace={true} /> : <h2>Sign In</h2>}</>;
};
