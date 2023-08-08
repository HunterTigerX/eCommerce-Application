import reactLogo from '@assets/react.svg';
import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        <img src={reactLogo} alt="Логотип" />
      </NavLink>
      <div className={styles['block-btns']}>
        <NavLink to="catalog">Catalog</NavLink>
        <NavLink to="cart">Сart</NavLink>
        <NavLink to="login">login</NavLink>
        <NavLink to="registration">registration</NavLink>
      </div>
    </nav>
  );
};
