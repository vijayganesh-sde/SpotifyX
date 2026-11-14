import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

test('shows the public landing page to signed-out visitors', () => {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: /get started free/i })).toBeInTheDocument();
});
