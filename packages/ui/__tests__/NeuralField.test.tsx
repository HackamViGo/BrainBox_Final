import { render, cleanup } from '@testing-library/react';
import { NeuralField } from '../src/NeuralField';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

describe('NeuralField', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 0)));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));
    
    // Mock getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    }) as any;
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders a canvas element', () => {
    const { container } = render(<NeuralField theme="chatgpt" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });

  it('accepts different modes without crashing', () => {
    const { rerender } = render(<NeuralField theme="chatgpt" mode="brain" />);
    rerender(<NeuralField theme="chatgpt" mode="wander" />);
    rerender(<NeuralField theme="chatgpt" mode="extension" />);
  });

  it('accepts different themes without crashing', () => {
    render(<NeuralField theme="claude" />);
    render(<NeuralField theme="gemini" />);
    render(<NeuralField theme="deepseek" />);
  });

  it('calls cancelAnimationFrame on unmount', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<NeuralField theme="chatgpt" />);
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
