import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/home/Home.tsx';
import { LoginPage } from '../pages/login/Login.tsx';
import { ProfilePage } from '../pages/profile/profilePage.tsx';
import { ErrorPage } from '../pages/error/error.tsx';
import { RootPage } from '../pages/root/rootPage.tsx';

import { Layout } from '@widgets/layout';
import { Registration } from '@pages/registration';
import { Catalog } from '@pages/catalogue';
import { Cart } from '@pages/cart';

import './styles/App.css';

export function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/" element={<RootPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
