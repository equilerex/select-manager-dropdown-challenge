import { render, screen } from '@testing-library/react';
import App from './App';

test('renders component', () => {
  render(<App />);
  const linkElement = screen.getByText(/Peakon Frontend challenge by/i);
  expect(linkElement).toBeInTheDocument();
});
