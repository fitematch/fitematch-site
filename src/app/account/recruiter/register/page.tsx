import type { Metadata } from "next";

import { RecruiterRegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "fitematch | Cadastro de Recrutador",
  description: "Crie sua conta de recrutador na fitematch.",
};

export default function RecruiterRegisterPage() {
  return <RecruiterRegisterForm />;
}
