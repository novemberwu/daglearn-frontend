import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: { name: 'Rachel Wu', id: '1' } },
    status: 'authenticated',
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

test('Sidebar renders branding and links', () => {
  render(<Sidebar />);
  expect(screen.getByText('NEXTLearn')).toBeDefined();
  expect(screen.getByText('Dashboard')).toBeDefined();
  expect(screen.getByText('Explore Topics')).toBeDefined();
});
