import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { AuthProvider } from '../context/AuthContext';

const renderLayout = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<div>Page Content</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('AppLayout', () => {
  it('toggles sidebar when mobile menu button is clicked', () => {
    renderLayout();
    
    const sidebar = screen.getByRole('complementary'); // aside
    expect(sidebar).not.toHaveClass('sidebar-open');
    
    const toggleBtn = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleBtn);
    
    expect(sidebar).toHaveClass('sidebar-open');
    
    // Test closing via overlay
    const overlay = screen.getByLabelText('Close sidebar');
    fireEvent.click(overlay);
    
    expect(sidebar).not.toHaveClass('sidebar-open');
  });
});
