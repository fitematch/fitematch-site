import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput } from './phone-input';

jest.mock('@/hooks/use-country-dial-codes', () => ({
  useCountryDialCodes: () => ({
    countries: [
      {
        isoCode: 'BR',
        name: 'Brasil',
        dialCode: '+55',
        flag: '🇧🇷',
        mask: '(##) #####-####',
      },
      {
        isoCode: 'US',
        name: 'Estados Unidos',
        dialCode: '+1',
        flag: '🇺🇸',
        mask: '(###) ###-####',
      },
    ],
    defaultCountry: {
      isoCode: 'BR',
      name: 'Brasil',
      dialCode: '+55',
      flag: '🇧🇷',
      mask: '(##) #####-####',
    },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

describe('PhoneInput', () => {
  it('máscara', () => {
    render(
      <PhoneInput
        countryValue="+55"
        numberValue="11987654321"
        onCountryChange={jest.fn()}
        onNumberChange={jest.fn()}
      />,
    );

    expect(screen.getByDisplayValue('+55 (11) 98765-4321')).toBeInTheDocument();
  });

  it('ddi', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();

    render(
      <PhoneInput
        countryValue="+55"
        numberValue=""
        onCountryChange={onCountryChange}
        onNumberChange={jest.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Brasil/i }));
    await user.click(screen.getByRole('option', { name: /Estados Unidos/i }));

    expect(onCountryChange).toHaveBeenCalledWith('+1');
  });

  it('alteração de valor', async () => {
    const user = userEvent.setup();
    const onNumberChange = jest.fn();

    render(
      <PhoneInput
        countryValue="+55"
        numberValue=""
        onCountryChange={jest.fn()}
        onNumberChange={onNumberChange}
      />,
    );

    await user.type(screen.getByPlaceholderText('+55 (##) #####-####'), '11987654321');

    await waitFor(() => {
      expect(onNumberChange).toHaveBeenCalled();
    });
  });

  it('callback', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();
    const onNumberChange = jest.fn();

    render(
      <PhoneInput
        countryValue="+55"
        numberValue=""
        onCountryChange={onCountryChange}
        onNumberChange={onNumberChange}
      />,
    );

    await user.type(screen.getByPlaceholderText('+55 (##) #####-####'), '11');

    expect(onNumberChange).toHaveBeenCalled();
    expect(onCountryChange).not.toHaveBeenCalled();
  });

  it('fecha menu ao clicar fora', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <PhoneInput
          countryValue="+55"
          numberValue=""
          onCountryChange={jest.fn()}
          onNumberChange={jest.fn()}
        />
        <button type="button">fora</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: /Brasil/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'fora' }));
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('mostra erro e respeita disabled', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();

    render(
      <PhoneInput
        countryValue="+55"
        numberValue=""
        onCountryChange={onCountryChange}
        onNumberChange={jest.fn()}
        error="Telefone inválido"
        disabled
      />,
    );

    expect(screen.getByText('Telefone inválido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Brasil/i })).toBeDisabled();
    expect(screen.getByPlaceholderText('+55 (##) #####-####')).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Brasil/i }));
    expect(onCountryChange).not.toHaveBeenCalled();
  });

  it('abre menu pelo teclado e fecha com escape', async () => {
    const user = userEvent.setup();

    render(
      <PhoneInput
        countryValue="+55"
        numberValue=""
        onCountryChange={jest.fn()}
        onNumberChange={jest.fn()}
      />,
    );

    const trigger = screen.getByRole('button', { name: /Brasil/i });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('mantém o cursor após o código do país ao focar o campo', async () => {
    const user = userEvent.setup();

    render(
      <PhoneInput
        countryValue="+55"
        numberValue=""
        onCountryChange={jest.fn()}
        onNumberChange={jest.fn()}
      />,
    );

    const input = screen.getByPlaceholderText('+55 (##) #####-####') as HTMLInputElement;

    await user.click(input);

    expect(input.selectionStart).toBe(3);
    expect(input.selectionEnd).toBe(3);
  });
});
