import { render, screen, fireEvent } from '@testing-library/react';
import { SignInInputForm } from '.';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

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

describe('SignInInputForm', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignInInputForm />
      </BrowserRouter>
    );
  });

  test('validates email format', async () => {
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(emailInput, { target: { value: 'sad@sda' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email address must be properly formatted')).toBeInTheDocument();
    expect(await screen.findByText('Please input your password!')).toBeInTheDocument();
  });

  test('should render the form correctly', () => {
    expect(screen.getByTitle('Email')).toBeInTheDocument();
    expect(screen.getByTitle('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});
