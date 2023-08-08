import { MainPage } from './pages/mainPage.tsx';
import { LoginPage } from './pages/loginPage.tsx';
import { ProfilePage } from './pages/profilePage.tsx';
import { ErrorPage } from './pages/errorPage.tsx';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import './styles/App.css';

export function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
