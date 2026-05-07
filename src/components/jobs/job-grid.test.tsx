import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobGrid } from './job-grid';
import { LanguagesEnum } from '@/types/entities/job.entity';

jest.mock('@/hooks/use-jobs', () => ({
  useJobs: jest.fn(),
}));

jest.mock('@/hooks/use-breakpoint', () => ({
  useBreakpoint: jest.fn(),
}));

jest.mock('./job-card', () => ({
  JobCard: ({ job }: { job: { title: string } }) => <div>{job.title}</div>,
}));

const { useJobs } = jest.requireMock('@/hooks/use-jobs') as { useJobs: jest.Mock };
const { useBreakpoint } = jest.requireMock('@/hooks/use-breakpoint') as {
  useBreakpoint: jest.Mock;
};

const jobs = [
  {
    _id: '1',
    title: 'Personal Trainer',
    contractType: 'clt',
    company: { tradeName: 'Smart Fit', contacts: { address: { city: 'Sao Paulo', state: 'SP' } } },
    requirements: { languages: [{ name: LanguagesEnum.ENGLISH }] },
  },
  {
    _id: '2',
    title: 'Instrutor de Yoga',
    contractType: 'pj',
    company: { tradeName: 'Bluefit', contacts: { address: { city: 'Rio', state: 'RJ' } } },
    requirements: { languages: [] },
  },
  {
    _id: '3',
    title: 'Professor de Pilates',
    contractType: 'clt',
    company: { tradeName: 'Studio', contacts: { address: { city: 'BH', state: 'MG' } } },
    requirements: { languages: [] },
  },
];

describe('JobGrid', () => {
  beforeEach(() => {
    useBreakpoint.mockReturnValue('desktop');
  });

  it('renderiza loading', () => {
    useJobs.mockReturnValue({ jobs: [], isLoading: true, error: null });
    const { container } = render(<JobGrid search="" />);

    expect(container.querySelectorAll('.animate-pulse').length).toBe(6);
  });

  it('renderiza erro', () => {
    useJobs.mockReturnValue({ jobs: [], isLoading: false, error: 'Erro' });
    render(<JobGrid search="" />);

    expect(screen.getByText('Erro')).toBeInTheDocument();
  });

  it('renderiza empty state', () => {
    useJobs.mockReturnValue({ jobs: [], isLoading: false, error: null });
    render(<JobGrid search="" />);

    expect(screen.getByText('Nenhuma vaga encontrada.')).toBeInTheDocument();
  });

  it('filtra por busca normalizada e pagina', async () => {
    const user = userEvent.setup();
    useJobs.mockReturnValue({ jobs, isLoading: false, error: null });
    useBreakpoint.mockReturnValue('mobile');

    render(<JobGrid search="sao paulo" />);

    expect(screen.getByText('Personal Trainer')).toBeInTheDocument();
    expect(screen.queryByText('Instrutor de Yoga')).not.toBeInTheDocument();

    render(<JobGrid search="" />);
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Próxima/i }));
    expect(screen.getByText('Professor de Pilates')).toBeInTheDocument();
  });

  it('filtra por idioma traduzido', () => {
    useJobs.mockReturnValue({ jobs, isLoading: false, error: null });
    render(<JobGrid search="ingles" />);

    expect(screen.getByText('Personal Trainer')).toBeInTheDocument();
    expect(screen.queryByText('Instrutor de Yoga')).not.toBeInTheDocument();
  });
});
