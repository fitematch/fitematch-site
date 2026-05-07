import { render, screen } from '@testing-library/react';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('render texto', () => {
    render(<EmptyState message="Nenhum registro encontrado." />);

    expect(screen.getByText('Nenhum registro encontrado.')).toBeInTheDocument();
  });
});
