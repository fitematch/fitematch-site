import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('render', () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
  });

  it('click', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Salvar</Button>);

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });

  it('loading', () => {
    render(
      <Button disabled aria-busy="true">
        Carregando...
      </Button>
    );

    expect(
      screen.getByRole('button', { name: 'Carregando...' })
    ).toHaveAttribute('aria-busy', 'true');
  });
});
