import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ProductList } from './ProductList.tsx';
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

describe('ProductList', () => {
  it('renders "No Products Found" message when there are no products and loading is false', () => {
    const { getByText } = render(<ProductList products={[]} loading={false} />);
    const noProductsMessage = getByText('No Products Found');
    expect(noProductsMessage).toBeInTheDocument();
  });

  it('renders loading spinner when loading is true', () => {
    const { container } = render(<ProductList products={[]} loading={true} />);
    const spinner = container.querySelector('.spin');
    expect(spinner).toBeInTheDocument();
  });
});
