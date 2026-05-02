'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FaSave } from 'react-icons/fa';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { useFlashMessage } from '@/contexts/flash-message-context';
import { JobService } from '@/services/job/job.service';
import { JobEntity } from '@/types/entities/job.entity';

interface RecruiterJobFormProps {
  mode: 'create' | 'edit';
  jobId?: string;
  initialValues?: JobEntity;
}

export enum JobContractTypeEnum {
  CLT = 'clt',
  PJ = 'pj',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  TEMPORARY = 'temporary',
  PART_TIME = 'part_time',
  FULL_TIME = 'full_time',
  AUTONOMOUS = 'autonomous',
}


interface RecruiterJobFormValues {
  title: string;
  description: string;
  slots: number;
  contractType: JobContractTypeEnum;
  salary?: number;
  coverUrl?: string;
}

export function RecruiterJobForm({
  mode,
  jobId,
  initialValues,
}: RecruiterJobFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useFlashMessage();
  const fieldClassName =
    'mt-2 w-full rounded-xl border border-gray-300 bg-black px-4 py-3 text-gray-300 outline-none placeholder:text-gray-300';

  const companyId = user?.recruiterProfile?.companyId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterJobFormValues>({
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      slots: initialValues?.slots || 1,
      contractType: JobContractTypeEnum.FREELANCE,
      salary: initialValues?.benefits?.salary,
      coverUrl: initialValues?.media?.coverUrl,
    },
  });

  async function onSubmit(data: RecruiterJobFormValues) {
    if (!companyId) {
      showError('Cadastre sua empresa antes de publicar vagas.');
      return;
    }

    try {
      if (mode === 'create') {
        await JobService.create({
          companyId,
          title: data.title,
          description: data.description,
          slots: Number(data.slots),
          contractType: data.contractType,
          benefits: {
            salary: data.salary ? Number(data.salary) : undefined,
          },
          media: {
            coverUrl: data.coverUrl,
          },
        });

        showSuccess('Vaga criada com sucesso.');
      }

      if (mode === 'edit' && jobId) {
        await JobService.update(jobId, {
          title: data.title,
          description: data.description,
          slots: Number(data.slots),
          contractType: data.contractType,
          benefits: {
            salary: data.salary ? Number(data.salary) : undefined,
          },
          media: {
            coverUrl: data.coverUrl,
          },
        });

        showSuccess('Vaga atualizada com sucesso.');
      }

      router.push(ROUTES.RECRUITER_JOBS);
    } catch {
      showError('Não foi possível salvar a vaga.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-gray-500 bg-black p-6"
    >
      {!companyId && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-900 p-4 text-sm text-red-100">
          Você precisa cadastrar sua empresa antes de publicar vagas.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-300">Título</label>
          <input
            className={fieldClassName}
            {...register('title', {
              required: 'Informe o título da vaga.',
            })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-100">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-300">Descrição</label>
          <textarea
            rows={5}
            className={fieldClassName}
            {...register('description', {
              required: 'Informe a descrição da vaga.',
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-100">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-300">Quantidade de vagas</label>
          <input
            type="number"
            min={1}
            className={fieldClassName}
            {...register('slots', {
              required: 'Informe a quantidade de vagas.',
              valueAsNumber: true,
              min: {
                value: 1,
                message: 'Informe pelo menos uma vaga.',
              },
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Tipo de contrato</label>
          <div className="relative">
            <select
              className={`${fieldClassName} appearance-none pr-12`}
              {...register('contractType', {
                required: 'Informe o tipo de contrato.',
              })}
            >
              <option value={JobContractTypeEnum.CLT}>CLT</option>
              <option value={JobContractTypeEnum.PJ}>PJ</option>
              <option value={JobContractTypeEnum.FREELANCE}>Freelance</option>
              <option value={JobContractTypeEnum.INTERNSHIP}>Estágio</option>
              <option value={JobContractTypeEnum.TEMPORARY}>Temporário</option>
              <option value={JobContractTypeEnum.PART_TIME}>Meio período</option>
              <option value={JobContractTypeEnum.FULL_TIME}>Tempo integral</option>
              <option value={JobContractTypeEnum.AUTONOMOUS}>Autônomo</option>
            </select>
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-300">
              <MdKeyboardDoubleArrowDown className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-300">Salário</label>
          <input
            type="number"
            className={fieldClassName}
            {...register('salary', {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Imagem da vaga</label>
          <input
            className={fieldClassName}
            {...register('coverUrl')}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="positive"
          icon={<FaSave />}
          disabled={isSubmitting || !companyId}
        >
          {mode === 'create' ? 'Criar vaga' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  );
}
