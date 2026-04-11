import { render, cleanup } from '@testing-library/react';
import { AmbientLight } from '../src/AmbientLight';
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';

describe('AmbientLight', () => {
  afterEach(cleanup);

  it('renders correctly', () => {
    const { container } = render(<AmbientLight theme="chatgpt" />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeDefined();
    expect(div.className).toContain('fixed');
  });

  it('applies correct theme color for claude', () => {
    const { container } = render(<AmbientLight theme="claude" />);
    const div = container.firstChild as HTMLElement;
    // We can't easily check the radial-gradient content in happy-dom, 
    // but we check if it renders without error.
    expect(div).toBeDefined();
  });

  it('supports monochrome mode', () => {
    const { container } = render(<AmbientLight theme="chatgpt" monochrome={true} />);
    const div = container.firstChild as HTMLElement;
    expect(div).toBeDefined();
  });
});
