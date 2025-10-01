// client/src/components/KeyLegend.test.tsx
import { render, screen } from '@testing-library/react';
import KeyLegend from './KeyLegend';

it('renders the keyboard legend with all keys and basic structure', () => {
  const { container } = render(<KeyLegend />);

  // accessible wrapper
  const legend = screen.getByLabelText(/keyboard navigation legend/i);
  expect(legend).toHaveAttribute('title', 'Keyboard navigation');

  // all keys present
  ['↑', '↓', 'Enter', '→', 'Esc', 'Backspace', '←'].forEach((k) =>
    expect(screen.getByText(k)).toBeInTheDocument()
  );

  // minimal structure checks
  expect(container.querySelectorAll<HTMLElement>('.legend__group').length).toBe(3);
  expect(container.querySelectorAll<HTMLElement>('.legend__dot').length).toBe(2);
  expect(container.querySelectorAll<HTMLElement>('kbd.legend__key').length).toBe(7);
});
