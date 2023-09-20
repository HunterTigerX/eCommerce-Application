import { render, screen } from '@testing-library/react';
import { Catalog } from './Catalog.tsx';
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

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ id: 'mockedId' }),
}));

jest.mock('@shared/api/products', () => ({
  useProductProjections: jest.fn().mockReturnValue({
    state: {
      products: [],
      loading: false,
      filter: {},
      count: 0,
      currentPage: 1,
    },
    dispatch: jest.fn(),
  }),
}));

jest.mock('@shared/api/categories', () => ({
  useCategories: jest.fn().mockReturnValue({
    categoriesTree: [],
  }),
}));

jest.mock('@widgets/ProductList', () => ({
  ProductList: jest.fn(() => <div>Mocked useCategories</div>),
}));

describe('render catalog', () => {
  beforeEach(() => {
    render(<Catalog />);
  });

  test('validates catalog text', async () => {
    expect(await screen.findByText('Mocked useCategories')).toBeInTheDocument();
  });
});
