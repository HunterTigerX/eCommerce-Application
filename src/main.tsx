import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './app/styles/global.css';
import { giveAnonToken } from './app/login/tokenMethods/anonToken/firstLogin.tsx';
import { checkToken } from './app/login/tokenMethods/checkToken/introspectToken.tsx';

async function checkAnonToken() {
  const tokenToCheck = localStorage.getItem('access_token');
  if (tokenToCheck) {
    checkToken(tokenToCheck);
  }
}

// Просто проверка на наличие анонимного токена
async function tokenFlow() {
  await giveAnonToken();
  await checkAnonToken();
}
tokenFlow();

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
