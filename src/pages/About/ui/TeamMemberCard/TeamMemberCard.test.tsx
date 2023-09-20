import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TeamMemberCard } from './TeamMemberCard.tsx';

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

const mockMember = {
  id: 2,
  name: 'John Doe',
  avatar: 'avatar.jpg',
  nickname: 'johndoe',
  githubLink: 'https://github.com/johndoe',
  role: 'Developer',
  description: 'Lorem ipsum dolor sit amet.',
};

test('renders TeamMemberCart component correctly', () => {
  render(<TeamMemberCard member={mockMember} />);

  // Check if the member's name is rendered
  const nameElement = screen.getByText(/John Doe/i);
  expect(nameElement).toBeInTheDocument();

  // Check if the role is rendered
  const roleElement = screen.getByText(/Developer/i);
  expect(roleElement).toBeInTheDocument();

  // Check if the GitHub link has the correct href attribute
  const githubLinkAnchor = screen.getByRole('link', { name: /johndoe/i });
  expect(githubLinkAnchor).toHaveAttribute('href', 'https://github.com/johndoe');

  // Check if the description is rendered
  const descriptionElement = screen.getByText(/Lorem ipsum dolor sit amet./i);
  expect(descriptionElement).toBeInTheDocument();
});
