import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './app/styles/global.css';

const rootElement = document.getElementById('root');

// import { useAuth } from '@shared/hooks';
// const { user, signIn, signOut, signUp } = useAuth();
// console.log(signIn())

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
