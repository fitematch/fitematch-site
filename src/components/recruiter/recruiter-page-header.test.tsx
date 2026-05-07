import { render, screen } from '@testing-library/react';
import { RecruiterPageHeader } from './recruiter-page-header';

describe('RecruiterPageHeader', () => {
  it('renderiza título, descrição, action e breadcrumb', () => {
    render(
      <RecruiterPageHeader
        title="Vagas"
        description="Gerencie suas vagas"
        action={<button type="button">Nova vaga</button>}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Vagas' },
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Vagas' })).toBeInTheDocument();
    expect(screen.getByText('Gerencie suas vagas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nova vaga' })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renderiza apenas o título sem opcionais', () => {
    render(<RecruiterPageHeader title="Empresa" />);

    expect(screen.getByRole('heading', { name: 'Empresa' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
