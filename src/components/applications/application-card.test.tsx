import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationCard } from './application-card';
import { renderWithProviders } from '@/tests/utils/render-with-providers';
import { ApplicationStatusEnum } from '@/types/entities/apply.entity';
import { resetMockDb } from '@/tests/mocks/handlers';
import { STORAGE_KEYS } from '@/constants/storage-keys';

const application = {
  _id: 'apply-1',
  jobId: 'job-1',
  userId: 'user-1',
  status: ApplicationStatusEnum.APPLIED,
  createdAt: '2026-05-03T10:00:00.000Z',
  details: {
    jobTitle: 'Personal Trainer',
    tradeName: 'Smart Fit',
    logoUrl: '/uploads/company/logo.png',
  },
};

describe('ApplicationCard', () => {
  beforeEach(() => {
    resetMockDb();
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'access-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('render dados', () => {
    renderWithProviders(<ApplicationCard application={application as never} />);

    expect(screen.getByText('Personal Trainer')).toBeInTheDocument();
    expect(screen.getByText('Smart Fit')).toBeInTheDocument();
    expect(screen.getByText('APLICADO')).toBeInTheDocument();
    expect(screen.getByText('Smart Fit - Personal Trainer')).toBeInTheDocument();
  });

  it('botão cancelar', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ApplicationCard application={application as never} />);

    await user.click(screen.getByRole('button', { name: /Cancelar Candidatura/i }));

    expect(screen.getByText('Cancelar aplicação')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar cancelamento/i })).toBeInTheDocument();
  });

  it('callback delete', async () => {
    const user = userEvent.setup();
    const onDeleted = jest.fn();

    renderWithProviders(
      <ApplicationCard application={application as never} onDeleted={onDeleted} />,
    );

    await user.click(screen.getByRole('button', { name: /Cancelar Candidatura/i }));
    await user.click(screen.getByRole('button', { name: /Confirmar cancelamento/i }));

    await waitFor(() => {
      expect(onDeleted).toHaveBeenCalledTimes(1);
    });
  });
});
