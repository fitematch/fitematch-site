import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobsPageContent } from './jobs-page-content';

jest.mock('@/components/jobs/job-grid', () => ({
  JobGrid: ({ search }: { search: string }) => <div>grid:{search}</div>,
}));

describe('JobsPageContent', () => {
  it('renderiza breadcrumb, busca e propaga search para grid', async () => {
    const user = userEvent.setup();

    render(<JobsPageContent />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Vagas')).toBeInTheDocument();
    expect(screen.getByText('grid:')).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(
        'Ex.: Personal Trainer ou São Paulo ou CLT ou PJ'
      ),
      'Yoga'
    );

    expect(screen.getByText('grid:Yoga')).toBeInTheDocument();
  });
});
