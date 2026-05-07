import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CancelApplicationButton } from './cancel-application-button';
import { ApplyService } from '@/services/apply/apply.service';

const push = jest.fn();
const showSuccess = jest.fn();
const showError = jest.fn();

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push,
  }),
}));

jest.mock('@/contexts/flash-message-context', () => ({
  useFlashMessage: () => ({
    showSuccess,
    showError,
  }),
}));

describe('CancelApplicationButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cancela candidatura, chama callback e redireciona', async () => {
    const user = userEvent.setup();
    const onDeleted = jest.fn();
    const deleteSpy = jest
      .spyOn(ApplyService, 'delete')
      .mockResolvedValue(undefined as never);

    render(<CancelApplicationButton applyId="apply-1" onDeleted={onDeleted} />);

    await user.click(screen.getByRole('button', { name: /Cancelar candidatura/i }));

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('apply-1');
    });
    expect(showSuccess).toHaveBeenCalledWith('Candidatura cancelada com sucesso.');
    expect(onDeleted).toHaveBeenCalled();
    expect(push).toHaveBeenCalled();
  });

  it('mostra erro quando falha', async () => {
    const user = userEvent.setup();
    jest.spyOn(ApplyService, 'delete').mockRejectedValue(new Error('fail'));

    render(<CancelApplicationButton applyId="apply-1" />);

    await user.click(screen.getByRole('button', { name: /Cancelar candidatura/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith(
        'Não foi possível cancelar sua candidatura.'
      );
    });
    expect(push).not.toHaveBeenCalled();
  });
});
