import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Layout } from '@widgets/layout';
//pages
import { Home } from '@pages/Home';
import { Login } from '@pages/Login';
import { Registration } from '@pages/Registration';
import { Catalog } from '@pages/Catalog';
import { Cart } from '@pages/Сart';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="cart" element={<Cart />} />
      <Route path="login" element={<Login />} />
      <Route path="registration" element={<Registration />} />
    </Route>
  )
);
