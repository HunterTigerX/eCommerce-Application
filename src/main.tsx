import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import './app/styles/global.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
