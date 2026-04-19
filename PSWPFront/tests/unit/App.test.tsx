import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

test('renders dashboard welcome message', async () => {
  render(<App />);
  expect(await screen.findByText('PSWP 社内業務システムへようこそ。')).toBeInTheDocument();
});
