import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';
import reactLogo from '@assets/react.svg';
import { UserAvatar } from '@widgets/userAvatar';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const username = (user && user.firstName) || '';

  const handleSignOut = () => {
    signOut().then(() => {
      navigate('/', {
        state: { bye: username },
      });
    });
  };

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        <img src={reactLogo} alt="Логотип" />
      </NavLink>
      <div className={styles.blockBtns}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="catalog">Catalog</NavLink>
        <NavLink to="cart">Cart</NavLink>
        {user ? (
          <>
            <NavLink onClick={handleSignOut} to="/">
              Sign Out
            </NavLink>
            <UserAvatar username={username} />
          </>
        ) : (
          <>
            <NavLink to="/signin">Sign In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};
