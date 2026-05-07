import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobSearchInput } from './job-search-input';

describe('JobSearchInput', () => {
  it('renderiza e altera valor', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<JobSearchInput value="" onChange={onChange} />);

    expect(screen.getByText('Busca de vagas')).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText(
        'Ex.: Personal Trainer ou São Paulo ou CLT ou PJ'
      ),
      'Pilates'
    );

    expect(onChange).toHaveBeenCalled();
  });
});
