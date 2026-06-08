import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormattedText from '../FormattedText';

test('renders plain text normally', () => {
  render(<FormattedText text="Hello World" />);
  expect(screen.getByText('Hello World')).toBeDefined();
});

test('renders inline code with custom formatting', () => {
  render(<FormattedText text="Use `int x = 5;` to declare x." />);
  expect(screen.getByText(/Use/)).toBeDefined();
  expect(screen.getByText(/to declare x\./)).toBeDefined();
  
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

test('renders inline LaTeX math formulas with superscript exponents', () => {
  render(<FormattedText text="The range is from $-2^{31}$ to $2^{31}-1$." />);
  expect(screen.getByText(/The range is from/)).toBeDefined();
  expect(screen.getByText(/to/)).toBeDefined();
  
  // Find mathematical nodes precisely
  expect(screen.getByText(/−2/)).toBeDefined();
  expect(screen.getAllByText('31')[0]).toBeDefined();
  expect(screen.getByText(/2.*−1/)).toBeDefined();
});

test('renders text within a pair of double asterisks as bold', () => {
  render(<FormattedText text="Make this **bold** text." />);
  expect(screen.getByText(/Make this/)).toBeDefined();
  expect(screen.getByText('bold')).toBeDefined();
  expect(screen.getByText(/text\./)).toBeDefined();
  
  const boldElement = screen.getByText('bold');
  expect(boldElement.tagName).toBe('STRONG');
  expect(boldElement.className).toContain('font-bold');
});

test('renders lines starting with a single asterisk as bullet points', () => {
  render(<FormattedText text={`* Item 1
* Item 2 with **bold** content`} />);
  expect(screen.getByText('Item 1')).toBeDefined();
  expect(screen.getByText(/Item 2 with/)).toBeDefined();
  expect(screen.getByText(/content/)).toBeDefined();
  expect(screen.getByText('bold')).toBeDefined();
  
  const boldElement = screen.getByText('bold');
  expect(boldElement.tagName).toBe('STRONG');
});

test('renders a markdown table with headers, body, alignments, and custom formatting', () => {
  const tableMarkdown = `| Type | Set of Values | Common Operations | Sample Value |
| :--- | :--- | :--- | :--- |
| **int** | Integers | \`+ - * / %\` | \`1\`, \`2\`, \`-34353\` |
| **double** | Floating-point numbers | \`+ - * / %\` | \`3.14\` |
| **boolean** | Boolean values | \`&& \\|\\| !\` | \`true\`, \`false\` |
| **char** | Characters | None | \`'A'\`, \`'1'\`, \`'\\n'\` |
| **String** | Sequences of characters | \`+\` (concatenation) | \`"Hello World"\` |`;

  render(<FormattedText text={tableMarkdown} />);

  // Check headers exist
  expect(screen.getByText('Type')).toBeDefined();
  expect(screen.getByText('Set of Values')).toBeDefined();
  expect(screen.getByText('Common Operations')).toBeDefined();
  expect(screen.getByText('Sample Value')).toBeDefined();

  // Check custom bolding is rendered inside table
  const intElement = screen.getByText('int');
  expect(intElement.tagName).toBe('STRONG');

  const doubleElement = screen.getByText('double');
  expect(doubleElement.tagName).toBe('STRONG');

  // Check cell content and check that escaped pipes are parsed cleanly
  expect(screen.getByText('Integers')).toBeDefined();
  
  // Check inline code blocks in table
  const plusMinusPercentElements = screen.getAllByText('+ - * / %');
  expect(plusMinusPercentElements.length).toBe(2); // for int and double
  plusMinusPercentElements.forEach(el => {
    expect(el.tagName).toBe('CODE');
  });

  const logicalOperatorsElement = screen.getByText('&& || !');
  expect(logicalOperatorsElement.tagName).toBe('CODE');

  const stringValElement = screen.getByText('"Hello World"');
  expect(stringValElement.tagName).toBe('CODE');
});
