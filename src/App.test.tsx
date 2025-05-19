import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Import dom-testing-library directly as the older @testing-library/react doesn't export screen or fireEvent
import { getByText, getByLabelText, findByText, queryByText } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

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
    
    const { container } = render(<ErrorMessage message={testMessage} onClose={handleClose} />);
    
    // Check if the message is displayed
    expect(getByText(container, testMessage)).toBeInTheDocument();
    
    // Check if the close button is present
    expect(getByLabelText(container, 'Close error message')).toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', () => {
    const testMessage = 'Test error message';
    const handleClose = vi.fn();
    
    const { container } = render(<ErrorMessage message={testMessage} onClose={handleClose} />);
    
    // Click the close button
    const closeButton = getByLabelText(container, 'Close error message');
    userEvent.click(closeButton);
    
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
    
    const { container } = render(<App />);
    
    // Click the "Paste from clipboard" button
    const pasteButton = getByText(container, 'Paste from clipboard');
    userEvent.click(pasteButton);
    
    // Check if the error message appears
    const errorMessage = await findByText(container, 'Clipboard access denied');
    expect(errorMessage).toBeInTheDocument();
    
    // Click the close button
    const closeButton = getByLabelText(container, 'Close error message');
    userEvent.click(closeButton);
    
    // Check if the error message disappears
    expect(queryByText(container, 'Clipboard access denied')).not.toBeInTheDocument();
    
    // Restore the original clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  });
});