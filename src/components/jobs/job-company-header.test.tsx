import { render, screen } from '@testing-library/react';
import { JobCompanyHeader } from './job-company-header';

const company = {
  tradeName: 'Smart Fit',
  contacts: {
    address: {
      city: 'Sao Paulo',
      state: 'SP',
    },
  },
  media: {
    logoUrl: '/logo.png',
  },
};

describe('JobCompanyHeader', () => {
  it('renderiza capa e logo quando existem', () => {
    render(
      <JobCompanyHeader
        job={{ title: 'Personal', media: { coverUrl: '/cover.png' } } as never}
        company={company as never}
      />
    );

    expect(screen.getByAltText('Personal')).toBeInTheDocument();
    expect(screen.getByAltText('Smart Fit')).toBeInTheDocument();
    expect(screen.getByText('Sao Paulo, SP')).toBeInTheDocument();
  });

  it('renderiza fallback da empresa sem logo', () => {
    render(
      <JobCompanyHeader
        job={{ title: 'Personal' } as never}
        company={{ ...company, media: undefined } as never}
      />
    );

    expect(screen.getByText('SM')).toBeInTheDocument();
  });

  it('não renderiza bloco da empresa quando company não existe', () => {
    render(<JobCompanyHeader job={{ title: 'Personal' } as never} />);

    expect(screen.queryByText('Smart Fit')).not.toBeInTheDocument();
  });
});
