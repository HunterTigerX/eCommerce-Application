import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Main } from './Main.tsx';

jest.mock('@assets/react.svg', () => '@assets/react.svg', { virtual: true });
jest.mock('@assets/typescript.svg', () => '@assets/typescript.svg', { virtual: true });
jest.mock('@assets/vite.svg', () => '@assets/vite.svg', { virtual: true });
jest.mock('@assets/ecommerce.svg', () => '@assets/ecommerce.svg', { virtual: true });
jest.mock('@assets/ant.svg', () => '@assets/ant.svg', { virtual: true });
jest.mock('./ui/IntroMain', () => ({
  IntroMain: jest.fn(() => <div>Mocked IntroMain</div>),
}));

describe('Main component', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      );
    });
  });

  test('renders the main page', async () => {
    expect(await screen.findByText('Mocked IntroMain')).toBeInTheDocument();
  });
});
