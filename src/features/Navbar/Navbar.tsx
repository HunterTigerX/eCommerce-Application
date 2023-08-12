import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import reactLogo from '@assets/react.svg';
// import { giveAnonToken } from '../../app/login/tokenMethods/anonToken/firstLogin.tsx';
// import { userDataParser } from '../../app/login/getCustomerFromLocalS.tsx';
import { ReturnAvatarLogo } from '../../widgets/userAvatar/avatar_logo.tsx';
// import { revokeToken } from '../../app/login/tokenMethods/removeToken/revokeToken.tsx';
import styles from './Navbar.module.css';

function userDataParser() {
  const userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  } else {
    return '';
  }
}

export const Navbar = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const Navigate = useNavigate();
  const userName = userDataParser().firstName;
  const customerId = localStorage.getItem('customerId');

  const logOutOfPage = () => {
    if (customerId) {
      const tokenToCheck = localStorage.getItem('access_token');

      if (tokenToCheck) {
        //        revokeToken(tokenToCheck);
      }

      Navigate('/main');
      localStorage.clear();
      //      giveAnonToken();

      messageApi.open({
        type: 'success',
        content: `Goodbye, ${userName}`,
      });
    } else {
      Navigate('/signin');
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
        <div className={styles.blockBtns}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/cart">Сart</NavLink>
          <NavLink to="/signin">Log In</NavLink>
          <NavLink to="/signup">Registration</NavLink>
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
          <NavLink to="catalog">Catalog</NavLink>
          <NavLink to="cart">Сart</NavLink>
          <NavLink onClick={logOutOfPage} to="/">
            Log Out
          </NavLink>
          {avatarLogo}
        </div>
      </nav>
    );
  }
};
