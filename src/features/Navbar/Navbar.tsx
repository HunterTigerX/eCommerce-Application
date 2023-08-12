import { message } from 'antd';
import { NavLink } from 'react-router-dom';
import reactLogo from '@assets/react.svg';
import { useAuth } from '@shared/hooks';
import { ReturnAvatarLogo } from '../../widgets/userAvatar/avatar_logo.tsx';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user, signOut } = useAuth();

  let userName = '';
  if (user && user.firstName) {
    userName = user.firstName;
  }
  const accessToken = localStorage.getItem('access_token');

  const logOutOfPage = () => {
    signOut().then();
    messageApi.open({
      type: 'success',
      content: `Goodbye, ${userName}`,
    });
  };

  const AvatarLogo = userName === '' ? ReturnAvatarLogo() : ReturnAvatarLogo(userName);
  const avatarLogo: JSX.Element | null = user?.id ? <AvatarLogo /> : null;

  if (accessToken) {
    return (
      <nav className={styles.navbar}>
        {contextHolder}
        <NavLink to="/" className={styles.logo}>
          <img src={reactLogo} alt="Логотип" />
        </NavLink>
        <div className={styles.blockBtns}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="catalog">Catalog</NavLink>
          <NavLink to="cart">Сart</NavLink>
          <NavLink onClick={logOutOfPage} to="/">
            Log Out
          </NavLink>
          {avatarLogo}
        </div>
      </nav>
    );
  } else {
    return (
      <nav className={styles.navbar}>
        {contextHolder}
        <NavLink to="/" className={styles.logo}>
          <img src={reactLogo} alt="Логотип" />
        </NavLink>
        <div className={styles.blockBtns}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/cart">Сart</NavLink>
          <NavLink to="/signin">Log In</NavLink>
          <NavLink to="/signup">Registration</NavLink>
        </div>
      </nav>
    );
  }
};
