import type { Metadata } from "next";

import { CandidateRegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "fitematch | Cadastro de Candidato",
  description: "Crie sua conta de candidato na fitematch.",
};

export default function CandidateRegisterPage() {
  return <CandidateRegisterForm />;
}
