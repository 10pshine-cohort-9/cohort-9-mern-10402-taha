import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import Loader from '../components/Loader/Loader.jsx';

describe('Button Component', () => {
  it('renders correctly and displays children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies default variant and size classes', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('btn-md');
  });

  it('applies custom variant and size classes', () => {
    render(<Button variant="outline" size="sm">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('btn-outline');
    expect(button).toHaveClass('btn-sm');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByText('Full')).toHaveClass('btn-full');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Input Component', () => {
  it('renders label and placeholder', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('accepts user input', () => {
    render(<Input label="Name" placeholder="Enter name" />);
    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    expect(input.value).toBe('John Doe');
  });

  it('displays error message and sets aria attributes', () => {
    render(<Input label="Password" error="Too short" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
    const input = screen.getByLabelText('Password');
    expect(input).toHaveClass('input-field-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('associates label with input using id', () => {
    render(<Input label="Username" id="username-input" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'username-input');
  });
});

describe('Loader Component', () => {
  it('renders with correct status role and aria label', () => {
    render(<Loader />);
    const loader = screen.getByRole('status');
    expect(loader).toHaveAttribute('aria-label', 'Loading');
    expect(loader).toBeInTheDocument();
  });

  it('applies custom size class', () => {
    render(<Loader size="lg" />);
    const loader = screen.getByRole('status');
    expect(loader.querySelector('.loader-spinner')).toHaveClass('loader-spinner-lg');
  });

  it('applies fullscreen class when fullScreen is true', () => {
    render(<Loader fullScreen />);
    expect(screen.getByRole('status')).toHaveClass('loader-fullscreen');
  });
});
