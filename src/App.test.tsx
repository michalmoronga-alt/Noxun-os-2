import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders app shell code', () => {
        render(<App />);
        expect(screen.getAllByText(/NOXUN OS/i)[0]).toBeInTheDocument();
    });
});
