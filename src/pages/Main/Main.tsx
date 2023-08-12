import { useAuth } from '@shared/hooks';
import { message } from 'antd';
import { useEffect } from 'react';

export const Main = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { user, signIn, signOut, signUp } = useAuth();

  useEffect(() => {
    const userDataLS = localStorage.getItem('userLoggedIn');
    if (user && userDataLS) {
      if (userDataLS) {
        messageApi.open({
          type: 'success',
          content: `Hello, ${user.firstName}`,
        });
        localStorage.removeItem('userLoggedIn');
      }
    }
  }, [messageApi, user]);

  const handleSignIn = () => {
    const credentials = { username: 'te1454mp555в@mail.ru', password: 'test' };

    signIn(credentials).then((result) => {
      if (!result.success) {
        console.log(result.message);
      }
    });
  };

  const handleSignUp = () => {
    const credentials = { email: 'te1454mp555в@mail.ru', password: 'test', lastName: 'J123oj', firstName: 'Koj123' };

    signUp(credentials).then((result) => {
      if (!result.success) {
        console.log(result.message);
      }
    });
  };

  const handleSignOut = () => {
    signOut().then();
  };

  return (
    <>
      <h2>Main page</h2>
      {contextHolder}
      {user ? (
        <p style={{ color: 'black' }}>
          Hi, {user.firstName} {user.lastName}.<button onClick={handleSignOut}>Sign Out</button>
        </p>
      ) : (
        <>
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </>
      )}
    </>
  );
};
