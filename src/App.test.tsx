import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Extract the ErrorMessage component for direct testing
// This is the same implementation from App.tsx
function ErrorMessage({ message, onClose }: { message: string, onClose: () => void }) {
  return (
    <div className="error-message">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close error message">×</button>
    </div>
  );
}

describe('ErrorMessage component', () => {
  it('renders error message correctly', () => {
    const testMessage = 'Test error message';
    const handleClose = vi.fn();
    
    render(<ErrorMessage message={testMessage} onClose={handleClose} />);
    
    // Check if the message is displayed
    expect(screen.getByText(testMessage)).toBeInTheDocument();
    
    // Check if the close button is present
    expect(screen.getByLabelText('Close error message')).toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', () => {
    const testMessage = 'Test error message';
    const handleClose = vi.fn();
    
    render(<ErrorMessage message={testMessage} onClose={handleClose} />);
    
    // Click the close button
    fireEvent.click(screen.getByLabelText('Close error message'));
    
    // Check if the onClose function was called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('Error handling in App component', () => {
  it('shows error message when clipboard operation fails', async () => {
    // Mock the clipboard API to throw an error
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockRejectedValue(new Error('Clipboard access denied')),
      },
      configurable: true,
    });
    
    render(<App />);
    
    // Click the "Paste from clipboard" button
    fireEvent.click(screen.getByText('Paste from clipboard'));
    
    // Check if the error message appears
    const errorMessage = await screen.findByText('Clipboard access denied');
    expect(errorMessage).toBeInTheDocument();
    
    // Click the close button
    fireEvent.click(screen.getByLabelText('Close error message'));
    
    // Check if the error message disappears
    expect(screen.queryByText('Clipboard access denied')).not.toBeInTheDocument();
    
    // Restore the original clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  });
});