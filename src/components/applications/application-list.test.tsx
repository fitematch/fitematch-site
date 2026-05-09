import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationList } from './application-list';
import { renderWithProviders } from '@/tests/utils/render-with-providers';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';

describe('ApplicationList', () => {
  beforeEach(() => {
    resetMockDb();
  });

  it('loading', () => {
    const { container } = renderWithProviders(<ApplicationList />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('erro', async () => {
    mockDb.apply.listStatus = 500;

    renderWithProviders(<ApplicationList />);

    expect(
      await screen.findByText('Não foi possível carregar suas candidaturas.'),
    ).toBeInTheDocument();
  });

  it('empty state', async () => {
    mockDb.apply.mine = [];

    renderWithProviders(<ApplicationList />);

    expect(
      await screen.findByText('Você ainda não se candidatou a nenhuma vaga!'),
    ).toBeInTheDocument();
  });

  it('lista aplicações', async () => {
    mockDb.apply.mine = [
      {
        ...mockDb.apply.mine[0],
        details: {
          jobTitle: 'Personal Trainer',
          tradeName: 'Smart Fit',
          logoUrl: '/uploads/company/logo.png',
        },
      } as never,
    ];

    renderWithProviders(<ApplicationList />);

    expect(await screen.findByText('Personal Trainer')).toBeInTheDocument();
    expect(screen.getByText('Smart Fit')).toBeInTheDocument();
    expect(screen.getByText('APLICADO')).toBeInTheDocument();
    expect(screen.getByText('Smart Fit - Personal Trainer')).toBeInTheDocument();
  });

  it('cancelar aplicação e refetch após delete', async () => {
    const user = userEvent.setup();

    mockDb.apply.mine = [
      {
        ...mockDb.apply.mine[0],
        details: {
          jobTitle: 'Personal Trainer',
          tradeName: 'Smart Fit',
        },
      } as never,
    ];

    renderWithProviders(<ApplicationList />);

    const cardTitle = await screen.findByText('Personal Trainer');
    const card = cardTitle.closest('article');

    expect(card).not.toBeNull();

    await user.click(
      within(card as HTMLElement).getByRole('button', {
        name: /Cancelar Candidatura/i,
      }),
    );

    expect(
      await screen.findByText(/Você realmente deseja cancelar sua candidatura/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Confirmar cancelamento/i }));

    await waitFor(() => {
      expect(screen.getByText('Você ainda não se candidatou a nenhuma vaga!')).toBeInTheDocument();
    });
  });
});
