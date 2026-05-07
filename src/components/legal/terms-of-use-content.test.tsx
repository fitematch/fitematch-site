import { render, screen } from '@testing-library/react';
import { TermsOfUseContent } from './terms-of-use-content';

describe('TermsOfUseContent', () => {
  it('renderiza textos principais', () => {
    render(<TermsOfUseContent />);

    expect(screen.getByText(/Ao utilizar a fitematch/)).toBeInTheDocument();
    expect(screen.getByText(/versão jurídica definitiva/)).toBeInTheDocument();
  });
});
