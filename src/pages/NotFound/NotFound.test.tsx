import { render, screen, fireEvent } from '@testing-library/react';
import { NotFound } from './NotFound.tsx';
import { BrowserRouter } from 'react-router-dom';
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

jest.mock('@shared/hooks', () => ({
  useAuth: jest.fn(),
}));

describe('NotFound', () => {
  test('renders NotFound component', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockImplementation(() => mockNavigate);
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    const button = screen.getByText('Back Home');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});
