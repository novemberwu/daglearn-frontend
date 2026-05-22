import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '../Sidebar';

test('Sidebar renders branding and links', () => {
  render(<Sidebar />);
  expect(screen.getByText('NEXTLearn')).toBeDefined();
  expect(screen.getByText('Dashboard')).toBeDefined();
  expect(screen.getByText('Explore Topics')).toBeDefined();
});
