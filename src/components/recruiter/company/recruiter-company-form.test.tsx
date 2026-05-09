import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecruiterCompanyForm } from './recruiter-company-form';
import { renderWithProviders } from '@/tests/utils/render-with-providers';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';
import { API_ENDPOINTS, apiUrl } from '@/tests/mocks/handlers/state';
import { HttpResponse, http } from '@/tests/mocks/msw-lite';
import { server } from '@/tests/mocks/server';
import { useFlashMessage } from '@/contexts/flash-message-context';

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

function FlashMessageProbe() {
  const { flashMessage } = useFlashMessage();

  return flashMessage ? <div>{flashMessage.message}</div> : null;
}

function renderCompanyForm() {
  return renderWithProviders(
    <>
      <RecruiterCompanyForm />
      <FlashMessageProbe />
    </>,
  );
}

async function uploadLogo(user: ReturnType<typeof userEvent.setup>) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['logo'], 'logo.png', { type: 'image/png' });

  fireEvent.change(input, {
    target: {
      files: [file],
    },
  });
  await user.click(await screen.findByRole('button', { name: /^Confirmar$/i }));
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await uploadLogo(user);

  await user.type(screen.getByPlaceholderText('00.000.000/0000-00'), '12345678000199');
  const cnpjInput = screen.getByPlaceholderText('00.000.000/0000-00');
  cnpjInput.blur();
  await screen.findByDisplayValue('Smart Fit');
  await screen.findByDisplayValue('Smart Fit Academia LTDA');

  fireEvent.change(document.querySelector('select[aria-hidden="true"]') as HTMLSelectElement, {
    target: { value: '+1' },
  });

  await user.type(screen.getByPlaceholderText('+1 (###) ###-####'), '2025550123');
  fireEvent.change(document.querySelector('input[name="email"]') as HTMLInputElement, {
    target: {
      value: 'contato@smartfit.com',
    },
  });
  await user.type(screen.getByPlaceholderText('01310-100'), '01310100');
  const zipInput = screen.getByPlaceholderText('01310-100');
  zipInput.blur();
  await screen.findByDisplayValue('Rua Augusta');
  await screen.findByDisplayValue('Consolação');
  await screen.findByDisplayValue('São Paulo');
  await screen.findAllByDisplayValue('SP');
  fireEvent.change(document.querySelector('input[name="number"]') as HTMLInputElement, {
    target: {
      value: '100',
    },
  });
}

describe('RecruiterCompanyForm', () => {
  beforeEach(() => {
    resetMockDb();
    server.use(
      http.get('https://brasilapi.com.br/api/cnpj/v1/:cnpj', () =>
        HttpResponse.json({
          razao_social: 'Smart Fit Academia LTDA',
          nome_fantasia: 'Smart Fit',
        }),
      ),
      http.get('https://viacep.com.br/ws/:zipCode/json/', () =>
        HttpResponse.json({
          logradouro: 'Rua Augusta',
          complemento: 'Conjunto 12',
          bairro: 'Consolação',
          localidade: 'São Paulo',
          uf: 'SP',
        }),
      ),
    );
  });

  it('GET /company/me sem empresa -> modo criação e POST /company/me', async () => {
    const user = userEvent.setup();
    mockDb.company.mineStatus = 404;
    mockDb.company.mine = null;

    renderCompanyForm();

    expect(await screen.findByRole('button', { name: /Salvar empresa/i })).toBeInTheDocument();

    await fillRequiredFields(user);

    await user.click(screen.getByRole('button', { name: /Salvar empresa/i }));

    await waitFor(() => {
      expect(mockDb.company.mine?.tradeName).toBe('Smart Fit');
    });

    expect(
      await screen.findByText('Empresa cadastrada com sucesso e enviada para aprovação.'),
    ).toBeInTheDocument();
    expect(document.querySelector('input[name="phoneCountry"]')).toHaveValue('+1');
    expect(mockDb.upload.lastUpload?.endpoint).toBe('/upload/company-logo');
  });

  it('GET /company/me com dados', async () => {
    renderCompanyForm();

    expect(await screen.findByRole('button', { name: /Atualizar empresa/i })).toBeInTheDocument();
    expect(document.querySelector('input[name="tradeName"]')).toHaveValue('Smart Fit');
    expect(document.querySelector('input[name="legalName"]')).toHaveValue(
      'Smart Fit Academia LTDA',
    );
  });

  it('renderiza loading inicial', () => {
    mockDb.company.mineStatus = 200;
    const { container } = renderCompanyForm();

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('mostra erro quando falha ao carregar empresa', async () => {
    mockDb.company.mineStatus = 500;

    renderCompanyForm();

    expect(
      await screen.findByText('Não foi possível carregar os dados da empresa.'),
    ).toBeInTheDocument();
  });

  it('mostra erro em submit inválido', async () => {
    const user = userEvent.setup();
    mockDb.company.mineStatus = 404;
    mockDb.company.mine = null;

    renderCompanyForm();

    await screen.findByRole('button', { name: /Salvar empresa/i });
    await user.click(screen.getByRole('button', { name: /Salvar empresa/i }));

    expect(
      await screen.findByText('Preencha os campos obrigatórios para salvar a empresa.'),
    ).toBeInTheDocument();
  });

  it('PATCH /company/me atualiza empresa com sucesso', async () => {
    const user = userEvent.setup();
    if (mockDb.company.mine) {
      mockDb.company.mine = {
        ...mockDb.company.mine,
        contacts: {
          ...mockDb.company.mine.contacts,
          address: {
            ...mockDb.company.mine.contacts.address,
            neighborhood: 'Consolação',
          } as never,
        },
      };
    }

    renderCompanyForm();

    await screen.findByRole('button', { name: /Atualizar empresa/i });
    await user.click(screen.getByRole('button', { name: /Atualizar empresa/i }));

    expect(await screen.findByText('Empresa atualizada com sucesso.')).toBeInTheDocument();
  });

  it('mostra erro quando falha ao salvar empresa', async () => {
    const user = userEvent.setup();
    mockDb.company.mineStatus = 404;
    mockDb.company.mine = null;
    server.use(
      http.post(apiUrl(API_ENDPOINTS.COMPANY_ME), () =>
        HttpResponse.json({ message: 'Falha ao criar.' }, { status: 500 }),
      ),
    );

    renderCompanyForm();

    await screen.findByRole('button', { name: /Salvar empresa/i });
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /Salvar empresa/i }));

    expect(await screen.findByText('Não foi possível cadastrar a empresa.')).toBeInTheDocument();
  });

  it('ignora lookup de CNPJ quando a consulta não retorna dados', async () => {
    const user = userEvent.setup();
    mockDb.company.mineStatus = 404;
    mockDb.company.mine = null;
    server.use(
      http.get('https://brasilapi.com.br/api/cnpj/v1/:cnpj', () =>
        HttpResponse.json({ message: 'CNPJ não encontrado.' }, { status: 404 }),
      ),
    );

    renderCompanyForm();

    await screen.findByRole('button', { name: /Salvar empresa/i });
    await user.type(screen.getByPlaceholderText('00.000.000/0000-00'), '12345678000199');
    screen.getByPlaceholderText('00.000.000/0000-00').blur();

    await waitFor(() => {
      expect(document.querySelector('input[name="tradeName"]')).toHaveValue('');
    });
  });

  it('ignora lookup de CEP quando a consulta não retorna dados', async () => {
    const user = userEvent.setup();
    mockDb.company.mineStatus = 404;
    mockDb.company.mine = null;
    server.use(
      http.get('https://viacep.com.br/ws/:zipCode/json/', () =>
        HttpResponse.json({ erro: true }, { status: 404 }),
      ),
    );

    renderCompanyForm();

    await screen.findByRole('button', { name: /Salvar empresa/i });
    await user.type(screen.getByPlaceholderText('01310-100'), '01310100');
    screen.getByPlaceholderText('01310-100').blur();

    await waitFor(() => {
      expect(document.querySelector('input[name="street"]')).toHaveValue('');
    });
  });
});
