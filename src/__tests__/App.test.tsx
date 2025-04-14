import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from '../App';
import authReducer from '../store/authSlice';
import budgetReducer from '../store/budgetSlice';
import { vi } from 'vitest';

// Mock the auth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    currentUser: { id: '1', email: 'test@example.com' },
    loading: false
  })
}));

// Mock the loadUserData action
vi.mock('../store/budgetSlice', async () => {
  const actual = await vi.importActual('../store/budgetSlice');
  return {
    ...actual,
    loadUserData: () => ({ type: 'budget/loadUserData' })
  };
});

const renderApp = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      budget: budgetReducer
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
};

describe('App Layout', () => {
  it('renders navigation by default', () => {
    renderApp();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('hides navigation on account pages', () => {
    window.history.pushState({}, '', '/account/profile');
    renderApp();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('hides navigation on settings page', () => {
    window.history.pushState({}, '', '/settings');
    renderApp();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('adjusts main content margin when navigation is collapsed', () => {
    renderApp();
    const main = screen.getByRole('main');
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    
    // Initial state - expanded
    expect(main).toHaveClass('ml-64');
    
    // Click to collapse
    fireEvent.click(collapseButton);
    expect(main).toHaveClass('ml-16');
    
    // Click to expand
    fireEvent.click(collapseButton);
    expect(main).toHaveClass('ml-64');
  });

  it('handles mobile view correctly', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    renderApp();
    const main = screen.getByRole('main');
    expect(main).not.toHaveClass('ml-64', 'ml-16');
  });
}); 
 
 
 
 
 
 