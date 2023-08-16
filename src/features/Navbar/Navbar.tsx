import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useAuth } from '@shared/hooks';
import logo from '@assets/logo.png';
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
        <img className={styles.logoImg} src={logo} alt="Логотип" />
      </NavLink>
      <div className={styles.blockBtns}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="catalog">Catalog</NavLink>
        <NavLink to="cart">Cart</NavLink>
        {user ? (
          <>
            <Button onClick={handleSignOut}>Sign Out</Button>
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
