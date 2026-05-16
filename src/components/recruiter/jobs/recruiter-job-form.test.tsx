import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { STORAGE_KEYS } from '@/constants/storage-keys';
import { ProductRoleEnum } from '@/types/entities/user.entity';
import { LanguagesEnum, LanguagesLevelEnum } from '@/types/entities/job.entity';
import { RecruiterJobForm } from './recruiter-job-form';
import { renderWithProviders } from '@/tests/utils/render-with-providers';
import { resetMockDb } from '@/tests/mocks/handlers';
import { mockDb } from '@/tests/mocks/handlers/state';
import { useFlashMessage } from '@/contexts/flash-message-context';

function FlashMessageProbe() {
  const { flashMessage } = useFlashMessage();

  return flashMessage ? <div>{flashMessage.message}</div> : null;
}

function setAuthenticatedRecruiter() {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'token');
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'refresh');
  mockDb.auth.meUser = {
    ...mockDb.auth.meUser!,
    productRole: ProductRoleEnum.RECRUITER,
    recruiterProfile: {
      companyId: 'company-1',
      tradeName: 'Smart Fit',
      company: mockDb.company.mine,
    },
  } as never;
}

function renderJobForm(ui: React.ReactElement) {
  return renderWithProviders(
    <>
      {ui}
      <FlashMessageProbe />
    </>,
  );
}

async function uploadCover(user: ReturnType<typeof userEvent.setup>) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['cover'], 'cover.png', { type: 'image/png' });

  fireEvent.change(input, {
    target: {
      files: [file],
    },
  });
  await user.click(await screen.findByRole('button', { name: /^Confirmar$/i }));
}

async function addLanguage(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Adicionar língua/i }));

  const modal = await screen.findByRole('heading', { name: 'Adicionar língua' });
  const scope = within(modal.closest('div[class*="rounded-2xl"]') as HTMLElement);
  const selects = scope.getAllByRole('combobox');

  await user.selectOptions(selects[0], 'english');
  await user.selectOptions(selects[1], 'basic');
  await user.click(scope.getByRole('button', { name: /Salvar/i }));
}

describe('RecruiterJobForm', () => {
  beforeEach(() => {
    resetMockDb();
    localStorage.clear();
    setAuthenticatedRecruiter();
  });

  async function fillCreateForm(user: ReturnType<typeof userEvent.setup>) {
    await uploadCover(user);

    const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
    const descriptionInput = document.querySelector(
      'textarea[name="description"]',
    ) as HTMLTextAreaElement;
    const contractSelect = document.querySelector(
      'select[name="contractType"]',
    ) as HTMLSelectElement;
    const educationSelect = document.querySelector(
      'select[name="educationLevel"]',
    ) as HTMLSelectElement;
    const salaryInputs = Array.from(document.querySelectorAll('input[type="text"]'));

    await user.selectOptions(contractSelect, 'clt');
    await user.type(titleInput, 'Professor de Musculação');
    await user.type(descriptionInput, 'Atuar no salão e orientar alunos.');
    await user.selectOptions(educationSelect, 'bachelor');
    await user.click(screen.getByRole('button', { name: /Aumentar Quantidade de vagas/i }));
    await user.click(screen.getByRole('button', { name: /Aumentar Experiência mínima/i }));
    await user.click(screen.getByRole('button', { name: /Aumentar Experiência máxima/i }));
    await addLanguage(user);
    await user.type(salaryInputs[salaryInputs.length - 1], '450000');
  }

  it('validações básicas', async () => {
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    await user.click(screen.getByRole('button', { name: /Criar/i }));

    expect(
      await screen.findByText('Preencha todos os campos obrigatórios da vaga.'),
    ).toBeInTheDocument();
  });

  it('create job com upload cover', async () => {
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    await fillCreateForm(user);
    await user.click(screen.getByRole('button', { name: /Criar/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(2);
    });

    expect(mockDb.upload.lastUpload?.endpoint).toBe('/upload/job-cover');
    expect(mockDb.job.mine[1].requirements?.languages).toEqual([
      {
        name: LanguagesEnum.PORTUGUESE,
        level: LanguagesLevelEnum.NATIVE,
      },
      {
        name: LanguagesEnum.ENGLISH,
        level: LanguagesLevelEnum.BASIC,
      },
    ]);
    expect(
      await screen.findByText('Vaga criada com sucesso e enviada para aprovação.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Atualizar/i })).toBeInTheDocument();
  });

  it('mantém português nativo fixo e remove idiomas já adicionados da modal', async () => {
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    expect(screen.getByText('Português')).toBeInTheDocument();
    expect(screen.getByText('Nativo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Deletar/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Adicionar língua/i }));

    let modal = await screen.findByRole('heading', { name: 'Adicionar língua' });
    let scope = within(modal.closest('div[class*="rounded-2xl"]') as HTMLElement);
    let languageSelect = scope.getAllByRole('combobox')[0] as HTMLSelectElement;

    expect(Array.from(languageSelect.options).map((option) => option.value)).not.toContain(
      LanguagesEnum.PORTUGUESE,
    );

    await user.selectOptions(languageSelect, LanguagesEnum.ENGLISH);
    await user.selectOptions(scope.getAllByRole('combobox')[1], LanguagesLevelEnum.BASIC);
    await user.click(scope.getByRole('button', { name: /Salvar/i }));

    await user.click(screen.getByRole('button', { name: /Adicionar língua/i }));

    modal = await screen.findByRole('heading', { name: 'Adicionar língua' });
    scope = within(modal.closest('div[class*="rounded-2xl"]') as HTMLElement);
    languageSelect = scope.getAllByRole('combobox')[0] as HTMLSelectElement;

    expect(Array.from(languageSelect.options).map((option) => option.value)).not.toContain(
      LanguagesEnum.ENGLISH,
    );
  });

  it('permite publicar quando readMine falha mas a empresa do usuário já está ativa', async () => {
    mockDb.company.mineStatus = 404;
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    expect(
      screen.queryByText(/Você precisa cadastrar sua empresa e esperar que ela seja aprovada/i),
    ).not.toBeInTheDocument();

    await fillCreateForm(user);
    await user.click(screen.getByRole('button', { name: /Criar/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(2);
    });
  });

  it('permite publicar quando a empresa existe mas ainda não foi aprovada', async () => {
    mockDb.company.mine = {
      ...mockDb.company.mine!,
      status: undefined,
      approval: undefined,
      documents: {
        ...mockDb.company.mine!.documents,
        isVerified: false,
      },
    } as never;
    mockDb.auth.meUser = {
      ...mockDb.auth.meUser!,
      recruiterProfile: {
        ...mockDb.auth.meUser!.recruiterProfile,
        company: {
          ...mockDb.auth.meUser!.recruiterProfile?.company,
          status: undefined,
          approval: undefined,
          documents: {
            ...mockDb.auth.meUser!.recruiterProfile?.company?.documents,
            isVerified: false,
          },
        },
      },
    } as never;
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    expect(
      screen.queryByText(/Você precisa cadastrar sua empresa antes de publicar vagas/i),
    ).not.toBeInTheDocument();

    await fillCreateForm(user);
    await user.click(screen.getByRole('button', { name: /Criar/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(2);
    });
  });

  it('permite publicar quando /auth/me não traz companyId mas readMine retorna empresa ativa', async () => {
    mockDb.auth.meUser = {
      ...mockDb.auth.meUser!,
      recruiterProfile: {
        ...mockDb.auth.meUser!.recruiterProfile,
        companyId: undefined,
      },
    } as never;
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    expect(
      screen.queryByText(/Você precisa cadastrar sua empresa e esperar que ela seja aprovada/i),
    ).not.toBeInTheDocument();

    await fillCreateForm(user);
    await user.click(screen.getByRole('button', { name: /Criar/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(2);
      expect(mockDb.job.mine[1].companyId).toBe('company-1');
    });
  });

  it('permite publicar quando a API retorna empresa aprovada sem status explícito', async () => {
    mockDb.company.mine = {
      ...mockDb.company.mine!,
      status: undefined,
      approval: {
        approvedAt: '2026-05-14T12:00:00.000Z',
      },
    } as never;
    const user = userEvent.setup();

    renderJobForm(<RecruiterJobForm mode="create" />);

    await screen.findByRole('button', { name: /Criar/i });
    expect(
      screen.queryByText(/Você precisa cadastrar sua empresa antes de publicar vagas/i),
    ).not.toBeInTheDocument();

    await fillCreateForm(user);
    await user.click(screen.getByRole('button', { name: /Criar/i }));

    await waitFor(() => {
      expect(mockDb.job.mine).toHaveLength(2);
    });
  });

  it('update job', async () => {
    const user = userEvent.setup();
    const initialJob = {
      ...mockDb.job.mine[0],
      media: {
        coverUrl: '/uploads/job-cover/old.png',
      },
      requirements: {
        educationLevel: 'bachelor',
        minExperienceYears: 1,
        maxExperienceYears: 2,
        languages: [
          {
            name: 'english',
            level: 'basic',
          },
        ],
      },
      benefits: {
        salary: 3500,
        healthInsurance: false,
        dentalInsurance: false,
        alimentationVoucher: false,
        transportationVoucher: false,
      },
    } as never;

    renderJobForm(<RecruiterJobForm mode="edit" jobId="job-1" initialValues={initialJob} />);

    await waitFor(() => {
      expect(document.querySelector('input[name="title"]')).not.toBeNull();
      expect((document.querySelector('input[name="title"]') as HTMLInputElement).value).toBe(
        'Personal Trainer',
      );
    });

    const titleInput = document.querySelector('input[name="title"]');
    expect(titleInput).not.toBeNull();
    await user.clear(titleInput as HTMLInputElement);
    await user.type(titleInput as HTMLInputElement, 'Personal Trainer Senior');
    await user.click(screen.getByRole('button', { name: /Atualizar/i }));

    await waitFor(() => {
      expect(mockDb.job.mine[0].title).toBe('Personal Trainer Senior');
    });

    expect(await screen.findByText('Vaga atualizada com sucesso.')).toBeInTheDocument();
  });
});
