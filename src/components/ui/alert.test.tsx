import { render, screen } from '@testing-library/react';
import { Alert } from './alert';

describe('Alert', () => {
  it('render error', () => {
    render(<Alert type="error" message="Ocorreu um erro." />);

    expect(screen.getByText('Ocorreu um erro.')).toBeInTheDocument();
  });

  it('render success', () => {
    render(<Alert type="success" message="Operação concluída." />);

    expect(screen.getByText('Operação concluída.')).toBeInTheDocument();
  });
});
