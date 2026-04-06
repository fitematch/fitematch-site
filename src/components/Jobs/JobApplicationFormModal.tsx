"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePublish } from "react-icons/md";

import { Job } from "@/interfaces/job.interface";
import { getProfileDataFromToken } from "@/utils/auth-profile";
import { useAuth } from "@/contexts/auth-context";

type JobApplicationFormState = {
  acceptTerms: boolean;
};

type SubmitFeedback = {
  type: "success";
  message: string;
} | null;

export default function JobApplicationFormModal({
  job,
  onClose,
}: Readonly<{
  job: Job;
  onClose: () => void;
}>) {
  const { accessToken } = useAuth();
  const [feedback, setFeedback] = useState<SubmitFeedback>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<JobApplicationFormState>({
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = useWatch({
    control,
    name: "acceptTerms",
  });
  const companyName = job.company.name || "a empresa";
  const city = job.company.address?.city?.trim() || "cidade não informada";
  const state = job.company.address?.state?.trim() || "estado não informado";
  const profileData = getProfileDataFromToken(accessToken);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback, onClose]);

  const onSubmit = async () => {
    setFeedback({
      type: "success",
      message: "Candidatura enviada com sucesso.",
    });
    reset({
      acceptTerms: false,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xs border border-gray-200 bg-[#FCFCFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-[#FCFCFC] px-6 py-5 md:px-8">
          <div>
            <h2 className="text-2xl font-bold text-black md:text-3xl">
              Candidatar a vaga de {job.title}
            </h2>
            <p className="mt-2 text-sm text-body-color">
              Revise as informações antes de participar do processo seletivo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-900"
          >
            <IoMdClose className="h-6 w-6" />
            <span className="sr-only">Fechar modal</span>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {feedback ? (
            <div className="space-y-6">
              <div className="w-full rounded-sm bg-green-900 px-6 py-4 text-center text-sm font-medium text-white">
                {feedback.message}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xs border border-green-900 bg-green-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-green-700 hover:bg-green-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
              <div className="rounded-xs border border-gray-200 bg-white p-6">
                <p className="text-base leading-relaxed text-body-color">
                  Ao enviar sua candidatura, você confirma que deseja participar
                  do processo seletivo da {companyName}, localizada em {city},
                  {` ${state}`}.
                </p>
              </div>

              <div className="rounded-xs border border-gray-200 bg-white p-6">
                <div className="space-y-4">
                  <p className="text-body-color text-base leading-relaxed md:text-lg">
                    <span className="font-bold text-black">Nome:</span> {profileData.name}
                  </p>
                  <p className="text-body-color text-base leading-relaxed md:text-lg">
                    <span className="font-bold text-black">Idade:</span> {profileData.age}
                  </p>
                  <p className="text-body-color text-base leading-relaxed md:text-lg">
                    <span className="font-bold text-black">E-mail:</span> {profileData.email}
                  </p>
                  <p className="text-body-color text-base leading-relaxed md:text-lg">
                    <span className="font-bold text-black">Telefone:</span> {profileData.phone}
                  </p>
                </div>
              </div>

              <div className="rounded-xs border border-gray-200 bg-white p-6">
                <Controller
                  control={control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <label
                      htmlFor="acceptJobApplicationTerms"
                      className="text-body-color flex cursor-pointer items-center gap-3 text-sm font-medium"
                    >
                      <input
                        type="checkbox"
                        id="acceptJobApplicationTerms"
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span>
                        Li e aceito os termos acima.
                      </span>
                    </label>
                  )}
                />
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xs border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-100"
                >
                  <IoIosArrowDropleft className="h-5 w-5 shrink-0" />
                  Voltar para detalhes
                </button>
                <button
                  type="submit"
                  disabled={!acceptTerms || isSubmitting}
                  className="shadow-submit inline-flex items-center justify-center gap-2 rounded-xs bg-green-900 px-6 py-3 text-sm font-medium text-white duration-300 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <MdOutlinePublish className="h-5 w-5 shrink-0" />
                  Enviar Candidatura
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
