import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import reactLogo from '@assets/react.svg';
import { giveAnonToken } from '../../app/login/tokenMethods/anonToken/firstLogin.tsx';
import { userDataParser } from '../../app/login/getCustomerFromLocalS.tsx';
import { ReturnAvatarLogo } from '../../widgets/userAvatar/avatar_logo.tsx';
import { revokeToken } from '../../app/login/tokenMethods/removeToken/revokeToken.tsx';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        <img src={reactLogo} alt="Логотип" />
      </NavLink>
      <div className={styles.blockBtns}>
        <NavLink to="/catalog">Catalog</NavLink>
        <NavLink to="/cart">Сart</NavLink>
        <NavLink to="/signin">login</NavLink>
        <NavLink to="/signup">registration</NavLink>
      </div>
    </nav>
  );
};
