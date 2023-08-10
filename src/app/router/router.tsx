import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '@widgets/layout';
import { Main, SignUp, Cart, Catalog, SignIn, NotFound } from '@pages';

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/signIn',
        element: <SignIn />,
        caseSensitive: true,
      },
      {
        path: '/signUp',
        element: <SignUp />,
        caseSensitive: true,
      },
      {
        path: '/catalog',
        element: <Catalog />,
        caseSensitive: true,
      },
      {
        path: '/cart',
        element: <Cart />,
        caseSensitive: true,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
