import { ApiError } from '@/services/http/api-error';
import { ViaCepResponse } from './address.types';

function normalizeZipCode(zipCode: string) {
  return zipCode.replace(/\D/g, '');
}

export const AddressService = {
  normalizeZipCode,

  async findByZipCode(zipCode: string): Promise<ViaCepResponse> {
    const normalizedZipCode = normalizeZipCode(zipCode);

    if (normalizedZipCode.length !== 8) {
      throw new ApiError('CEP inválido.', 400);
    }

    const response = await fetch(
      `https://viacep.com.br/ws/${normalizedZipCode}/json/`
    );

    if (!response.ok) {
      throw new ApiError('Não foi possível consultar o CEP.', response.status);
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      throw new ApiError('CEP não encontrado.', 404, data);
    }

    return data;
  },
};

