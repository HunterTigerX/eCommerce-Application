import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import reactLogo from '@assets/react.svg';
import { giveAnonToken } from '../../app/login/tokenMethods/anonToken/firstLogin.tsx';
import { userDataParser } from '../../app/login/getCustomerFromLocalS.tsx';
import { ReturnAvatarLogo } from '../../widgets/userAvatar/avatar_logo.tsx';
import { revokeToken } from '../../app/login/tokenMethods/removeToken/revokeToken.tsx';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const Navigate = useNavigate();
  const userName = userDataParser().firstName;
  const customerId = localStorage.getItem('customerId');

  const mainPage = () => {
    Navigate('/login');
  };

  const logOutOfPage = () => {
    if (customerId) {
      const tokenToCheck = localStorage.getItem('access_token');

      if (tokenToCheck) {
        revokeToken(tokenToCheck);
      }

      Navigate('/main');
      localStorage.clear();
      giveAnonToken();

      messageApi.open({
        type: 'success',
        content: `Goodbye, ${userName}`,
      });
    } else {
      Navigate('/login');
    }
  };

  const AvatarLogo = userName === '' ? ReturnAvatarLogo() : ReturnAvatarLogo(userName);
  const avatarLogo: JSX.Element | null = customerId ? <AvatarLogo /> : null;

  if (!customerId) {
    return (
      <nav className={styles.navbar}>
        {contextHolder}
        <NavLink to="/" className={styles.logo}>
          <img src={reactLogo} alt="Логотип" />
        </NavLink>
        <div className={styles['block-btns']}>
          <NavLink to="main">Home</NavLink>
          <NavLink to="catalog">Catalog</NavLink>
          <NavLink to="cart">Сart</NavLink>
          <NavLink to="login">Log In</NavLink>
          <NavLink to="registration">Registration</NavLink>
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
        <div className={styles['block-btns']}>
          <Button type="primary" onClick={mainPage}>
            Login test button
          </Button>
          <NavLink to="main">Home</NavLink>
          <NavLink to="catalog">Catalog</NavLink>
          <NavLink to="cart">Сart</NavLink>
          <NavLink onClick={logOutOfPage} to="main">
            Log Out
          </NavLink>
          {avatarLogo}
        </div>
      </nav>
    );
  }
};
