import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from '../../src/components/Layout';

describe('Layout navigation', () => {
  test('shows sidebar sections and links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Dashboard Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MCA Pattern' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mail Setting' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Strategy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'System Setting' })).toBeInTheDocument();
  });

  test('marks active link by current path', () => {
    render(
      <MemoryRouter initialEntries={['/master/strategy']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="master/strategy" element={<div>Strategy Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const strategyLink = screen.getByRole('link', { name: 'Strategy' });
    expect(strategyLink).toHaveClass('active');
  });
});
