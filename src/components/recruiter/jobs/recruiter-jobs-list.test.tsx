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
      </>
    );
  }

  it('loading', () => {
    renderList();

    expect(screen.getByText('Carregando vagas...')).toBeInTheDocument();
  });

  it('erro', async () => {
    mockDb.job.mineStatus = 500;

    renderList();

    expect(
      await screen.findByText('Não foi possível carregar suas vagas.')
    ).toBeInTheDocument();
  });

  it('GET /job/me e lista vagas', async () => {
    renderList();

    expect(await screen.findByText('Personal Trainer')).toBeInTheDocument();
    expect(screen.getByText('Atendimento de alunos e prescrição de treinos.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Editar/i })).toHaveAttribute(
      'href',
      '/recruiter/jobs/job-1/edit'
    );
  });

  it('delete vaga', async () => {
    const user = userEvent.setup();

    renderList();

    const articleTitle = await screen.findByText('Personal Trainer');
    const article = articleTitle.closest('article');

    await user.click(
      within(article as HTMLElement).getByRole('button', { name: /Remover/i })
    );
    await user.click(screen.getByRole('button', { name: /Apagar Vaga/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(0);
    });

    expect(await screen.findByText('Vaga removida com sucesso.')).toBeInTheDocument();
    expect(
      screen.getByText('Você ainda não publicou nenhuma vaga.')
    ).toBeInTheDocument();
  });
});
