import { useEffect, useState } from 'react';
import { UserMenu } from './ui/UserMenu';
import { NavList } from './ui/NavList';
import { Logo } from './ui/Logo';
import { BurgerMenu } from './ui/BurgerMenu';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isOverflowHidden, setIsOverflowHidden] = useState(false);

  const handleMenuClick = () => {
    setIsMenuClicked(!isMenuClicked);
    setIsOverflowHidden(!isOverflowHidden);
  };

  const handleMenuClose = () => {
    setIsMenuClicked(false);
  };

  const navMenuClass = isMenuClicked ? `${styles.navMenu} ${styles.open}` : styles.navMenu;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.navbar}`)) {
        setIsOverflowHidden(false);
        setIsMenuClicked(false);
      }
    };

    if (isOverflowHidden) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    if (isMenuClicked) {
      document.body.addEventListener('click', handleOutsideClick);
    }

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [isMenuClicked, isOverflowHidden]);

  return (
    <div className={styles.navbar}>
      <Logo />
      <div className={navMenuClass}>
        <NavList onCloseMenu={handleMenuClose} />
        <UserMenu onCloseMenu={handleMenuClose} />
      </div>
      <BurgerMenu isMenuClicked={isMenuClicked} onBurgerClick={handleMenuClick} />
    </div>
  );
};
