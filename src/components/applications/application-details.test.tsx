import { render, screen } from '@testing-library/react';
import { ApplicationDetails } from './application-details';

jest.mock('@/hooks/use-applications', () => ({
  useApplication: jest.fn(),
}));

jest.mock('./cancel-application-button', () => ({
  CancelApplicationButton: ({ applyId }: { applyId: string }) => (
    <button type="button">cancel-{applyId}</button>
  ),
}));

const { useApplication } = jest.requireMock('@/hooks/use-applications') as {
  useApplication: jest.Mock;
};

describe('ApplicationDetails', () => {
  it('renderiza loading', () => {
    useApplication.mockReturnValue({
      application: null,
      isLoading: true,
      error: null,
    });

    const { container } = render(<ApplicationDetails applyId="apply-1" />);

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renderiza erro', () => {
    useApplication.mockReturnValue({
      application: null,
      isLoading: false,
      error: 'Erro ao carregar',
    });

    render(<ApplicationDetails applyId="apply-1" />);

    expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
  });

  it('retorna null quando não há application', () => {
    useApplication.mockReturnValue({
      application: null,
      isLoading: false,
      error: null,
    });

    const { container } = render(<ApplicationDetails applyId="apply-1" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza detalhes da aplicação', () => {
    useApplication.mockReturnValue({
      application: {
        _id: 'apply-1',
        status: 'applied',
        jobId: 'job-1',
        userId: 'user-1',
      },
      isLoading: false,
      error: null,
    });

    render(<ApplicationDetails applyId="apply-1" />);

    expect(screen.getByText('Aplicação #apply-1')).toBeInTheDocument();
    expect(screen.getByText('Status: applied')).toBeInTheDocument();
    expect(screen.getByText('Job ID: job-1')).toBeInTheDocument();
    expect(screen.getByText('User ID: user-1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'cancel-apply-1' })).toBeInTheDocument();
  });
});
