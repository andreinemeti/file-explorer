// client/src/components/DetailsPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import DetailsPanel from './DetailsPanel';

afterEach(() => vi.restoreAllMocks());

it('shows hint when nothing selected', () => {
  render(<DetailsPanel entry={null} />);
  expect(screen.getByText(/select a file or directory/i)).toBeInTheDocument();
});

describe('<DetailsPanel />', () => {
  const createdAt = '2024-01-01T00:00:00.000Z';
  const modifiedAt = '2024-01-02T12:34:56.000Z';

  // Avoid locale differences
  const mockDateStrings = () => {
    vi.spyOn(global.Date.prototype, 'toLocaleString').mockReturnValue('MOCKED-DATE');
  };

  it('renders a FILE with size and dates', () => {
    mockDateStrings();
    render(
      <DetailsPanel
        entry={{
          name: 'readme.txt',
          path: 'docs/readme.txt',
          type: 'file',
          size: 123,
          createdAt,
          modifiedAt,
        }}
      />
    );

    expect(screen.getByText('readme.txt')).toBeInTheDocument();
    expect(screen.getByText(/type/i).nextSibling?.textContent).toBe('file');
    expect(screen.getByText(/size/i).nextSibling?.textContent).toBe('123 bytes');
    // created/modified use mocked string
    expect(screen.getAllByText('MOCKED-DATE').length).toBe(2);
    // path dd has correct text and title
    const pathEl = screen.getByTitle('docs/readme.txt');
    expect(pathEl).toHaveClass('panel__path');
    expect(pathEl.textContent).toBe('docs/readme.txt');
  });

  it('renders a DIRECTORY without the Size row', () => {
    mockDateStrings();
    render(
      <DetailsPanel
        entry={{
          name: 'docs',
          path: 'docs',
          type: 'directory',
          createdAt,
          modifiedAt,
        }}
      />
    );

    const titleEl = screen.getByText('docs', { selector: '.panel__title' });
    expect(titleEl).toBeInTheDocument();
    // no "Size" label at all for directories
    expect(screen.queryByText(/^Size$/i)).toBeNull();
    // dates still shown
    expect(screen.getAllByText('MOCKED-DATE').length).toBe(2);
  });

  it('falls back to "/" for empty name/path (root)', () => {
    mockDateStrings();
    render(
      <DetailsPanel
        entry={{
          name: '',        // root-like entry
          path: '',
          type: 'directory',
          createdAt,
          modifiedAt,
        }}
      />
    );

    const titleRoot = screen.getByText('/', { selector: '.panel__title' });
    expect(titleRoot).toBeInTheDocument();

    const pathRoot = screen.getByTitle('/');
    expect(pathRoot).toHaveTextContent('/');
  });
});
