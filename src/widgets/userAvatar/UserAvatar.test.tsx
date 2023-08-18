import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserAvatar } from './UserAvatar.tsx';
import '@testing-library/jest-dom/extend-expect';
import * as router from 'react-router';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    writable: true,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('renders UserAvatar component', () => {
  const username = 'test';
  render(
    <BrowserRouter>
      <UserAvatar username={username} />
    </BrowserRouter>
  );
  const userAvatarElement = screen.getByText(username);
  expect(userAvatarElement).toBeInTheDocument();
});

const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);
});

test('handles click event', () => {
  const username = 'test';

  render(
    <BrowserRouter>
      <UserAvatar username={username} />
    </BrowserRouter>
  );

  const avatarElement = screen.getByText(username);
  fireEvent.click(avatarElement);
  expect(navigate).toHaveBeenCalledWith('/profile');
});
