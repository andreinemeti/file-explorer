import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import FileList from './FileList';
import type { FileSystemEntry } from '../types';

const items: FileSystemEntry[] = [
  { name: 'dirA', path: 'dirA', type: 'directory', createdAt: '', modifiedAt: '' },
  { name: 'file1.txt', path: 'file1.txt', type: 'file', size: 5, createdAt: '', modifiedAt: '' },
];

// Small wrapper so the test owns selectedIndex state
function ListWithState(props: Omit<React.ComponentProps<typeof FileList>, 'selectedIndex' | 'setSelectedIndex'>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  return <FileList selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} {...props} />;
}

it('shows Empty and allows Esc to navigate up when there are no items', async () => {
  const user = userEvent.setup();
  const onNavigateUp = vi.fn();

  render(
    <ListWithState items={[]} onOpen={() => {}} onNavigateUp={onNavigateUp} />
  );

  expect(screen.getByText(/empty/i)).toBeInTheDocument();

  await user.keyboard('{Escape}');
  expect(onNavigateUp).toHaveBeenCalledTimes(1);
});

it('ArrowDown selects first item and Enter opens it', async () => {
  const user = userEvent.setup();
  const onOpen = vi.fn();

  render(
    <ListWithState items={items} onOpen={onOpen} onNavigateUp={() => {}} />
  );

  // start with nothing selected; first ArrowDown selects index 0
  await user.keyboard('{ArrowDown}{Enter}');
  expect(onOpen).toHaveBeenCalledWith(items[0]);
});
