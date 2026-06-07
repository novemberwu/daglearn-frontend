import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormattedText from '../FormattedText';

test('renders plain text normally', () => {
  render(<FormattedText text="Hello World" />);
  expect(screen.getByText('Hello World')).toBeDefined();
});

test('renders inline code with custom formatting', () => {
  render(<FormattedText text="Use `int x = 5;` to declare x." />);
  expect(screen.getByText('Use')).toBeDefined();
  expect(screen.getByText('to declare x.')).toBeDefined();
  
  const codeElement = screen.getByText('int x = 5;');
  expect(codeElement.tagName).toBe('CODE');
  expect(codeElement.className).toContain('font-mono');
  expect(codeElement.className).toContain('text-pink-600');
});

test('renders multiline code blocks with language tag', () => {
  const code = '```java\nint a = 10;\nSystem.out.println(a);\n```';
  render(<FormattedText text={code} />);
  
  // Checks for language header
  expect(screen.getByText('java')).toBeDefined();
  
  // Checks that code block content renders
  expect(screen.getByText(/int a = 10;[\s\S]*System\.out\.println\(a\);/)).toBeDefined();
});

test('renders multiline code blocks without language tag', () => {
  const code = '```\nsome raw code block\n```';
  render(<FormattedText text={code} />);
  
  expect(screen.getByText('some raw code block')).toBeDefined();
});

test('handles mixed content with multiple backticks', () => {
  const content = 'First inline: `a = 1` and code block:\n```python\nprint("hi")\n```\nLast text.';
  render(<FormattedText text={content} />);
  
  expect(screen.getByText(/First inline:/)).toBeDefined();
  expect(screen.getByText('a = 1')).toBeDefined();
  expect(screen.getByText('python')).toBeDefined();
  expect(screen.getByText('print("hi")')).toBeDefined();
  expect(screen.getByText(/Last text\./)).toBeDefined();
});
