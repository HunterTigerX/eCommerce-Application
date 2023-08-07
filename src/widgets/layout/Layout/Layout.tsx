import { Outlet } from 'react-router-dom';
import { Footer, Header } from '..';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
