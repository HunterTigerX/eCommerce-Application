import { render } from '@testing-library/react';
import { Pagination } from './Pagination.tsx';
import '@testing-library/jest-dom/extend-expect';

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

describe('Pagination', () => {
  it('renders total item count when count is not null', () => {
    const { getByText } = render(<Pagination count={50} loading={false} currentPage={1} onPageChange={() => {}} />);
    const totalText = getByText('Total 50 items');
    expect(totalText).toBeInTheDocument();
  });

  it('does not render total item count when count is null', () => {
    const { queryByText } = render(<Pagination count={null} loading={false} currentPage={1} onPageChange={() => {}} />);
    const totalText = queryByText('Total');
    expect(totalText).toBeNull();
  });

  it('disables pagination when loading is true', () => {
    const { container } = render(<Pagination count={50} loading={true} currentPage={1} onPageChange={() => {}} />);
    const paginationContainer = container.querySelector('.ant-pagination');
    expect(paginationContainer).toHaveClass('ant-pagination-disabled');
  });
});
