import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { About } from './About.tsx';
import { BrowserRouter } from 'react-router-dom';

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

jest.mock('@assets/about.jpg', () => '@assets/about.jpg', { virtual: true });
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
  },
}));
jest.mock('@assets/rss.jpg', () => '@assets/rss.jpg', { virtual: true });
jest.mock('@assets/nikita.png', () => '@assets/nikita.png', { virtual: true });
jest.mock('@assets/Vitaliy.jpg', () => '@assets/Vitaliy.jpg', { virtual: true });

describe('render about', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
  });

  test('validates about text', async () => {
    expect(await screen.findByText('Discord')).toBeInTheDocument();
  });
});
