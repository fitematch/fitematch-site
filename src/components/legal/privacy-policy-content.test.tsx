import { render, screen } from '@testing-library/react';
import { PrivacyPolicyContent } from './privacy-policy-content';

describe('PrivacyPolicyContent', () => {
  it('renderiza textos principais', () => {
    render(<PrivacyPolicyContent />);

    expect(screen.getByText(/A fitematch coleta dados necessários/)).toBeInTheDocument();
    expect(screen.getByText(/versão jurídica definitiva/)).toBeInTheDocument();
  });
});
