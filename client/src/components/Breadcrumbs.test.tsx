import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Breadcrumbs from './Breadcrumbs';

it('renders root and segments, and navigates on click', async () => {
  const user = userEvent.setup();
  const onNavigate = vi.fn();
  render(<Breadcrumbs path="dirA/child" onNavigate={onNavigate} />);

  expect(screen.getByRole('button', { name: /root/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'dirA' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'child' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /root/i }));
  expect(onNavigate).toHaveBeenCalledWith('');

  await user.click(screen.getByRole('button', { name: 'dirA' }));
  expect(onNavigate).toHaveBeenCalledWith('dirA');
});
