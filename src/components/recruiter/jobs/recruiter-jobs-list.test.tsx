import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecruiterJobsList } from './recruiter-jobs-list';
import { renderWithProviders } from '@/tests/utils/render-with-providers';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';
import { useFlashMessage } from '@/contexts/flash-message-context';

function FlashMessageProbe() {
  const { flashMessage } = useFlashMessage();

  return flashMessage ? <div>{flashMessage.message}</div> : null;
}

describe('RecruiterJobsList', () => {
  beforeEach(() => {
    resetMockDb();
  });

  function renderList() {
    return renderWithProviders(
      <>
        <RecruiterJobsList />
        <FlashMessageProbe />
      </>,
    );
  }

  it('loading', () => {
    const { container } = renderList();

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('erro', async () => {
    mockDb.job.mineStatus = 500;

    renderList();

    expect(await screen.findByText('Não foi possível carregar suas vagas.')).toBeInTheDocument();
  });

  it('GET /job/me e lista vagas', async () => {
    const { container } = renderList();

    expect(await screen.findAllByText('Personal Trainer')).not.toHaveLength(0);
    expect(screen.getAllByText('Atendimento de alunos e prescrição de treinos.')).not.toHaveLength(
      0,
    );
    expect(screen.getAllByRole('link', { name: /Editar/i })[0]).toHaveAttribute(
      'href',
      '/recruiter/jobs/job-1/edit',
    );
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('delete vaga', async () => {
    const user = userEvent.setup();

    renderList();

    await screen.findAllByText('Personal Trainer');
    const article = document.querySelector('article');

    expect(article).not.toBeNull();

    await user.click(within(article as HTMLElement).getByRole('button', { name: /Remover/i }));
    await user.click(screen.getByRole('button', { name: /Apagar Vaga/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(0);
    });

    expect(await screen.findByText('Vaga removida com sucesso.')).toBeInTheDocument();
    expect(screen.getByText('Você ainda não publicou nenhuma vaga.')).toBeInTheDocument();
  });
});
