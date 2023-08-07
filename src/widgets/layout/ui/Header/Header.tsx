import styles from './Header.module.css';

import { Navbar } from '@features/Navbar';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Navbar />
    </header>
  );
};
