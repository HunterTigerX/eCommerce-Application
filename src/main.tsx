import React from 'react';
import App from './app/App.tsx';
import './app/styles/global.css';
import { giveAnonToken } from './app/login/firstLogin.tsx';
import { createRoot } from 'react-dom/client';

// То что ниже пока временно, то что выше вроде постоянно
// import { getApiRoot } from './lib/ClientBuilder.ts';

//
import { checkToken } from './app/login/tokenMethods/introspectToken.tsx';

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

//

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// function successLogOut(): void {}

// function successLogIn(): void {}
