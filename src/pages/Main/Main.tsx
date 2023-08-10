import { useAuth } from '@shared/hooks';

export const Main = () => {
  const { user, signIn, signOut, signUp } = useAuth();

  const handleSignIn = () => {
    signIn({ username: 'ooooooo2q35@gmail.com', password: 'test' });
  };

  const handleSignUp = () => {
    signUp({ email: 'te144mp555в@mail.ru', password: 'test', lastName: 'Joj', firstName: 'Koj' });
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <h2>Main page</h2>
      {}
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
