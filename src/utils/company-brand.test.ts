import { getUniqueCompaniesByBrand } from './company-brand';
import { PublicCompanyResponse } from '@/services/company/company.types';

function company(tradeName: string, id: string): PublicCompanyResponse {
  return {
    _id: id,
    slug: tradeName.toLowerCase().replace(/\s+/g, '-'),
    tradeName,
  };
}

describe('getUniqueCompaniesByBrand', () => {
  it('remove unidades da mesma marca', () => {
    const companies = [
      company('Blue Fit', '1'),
      company('Bluefit Salvador', '2'),
      company('Bluefit Santos', '3'),
      company('Smart Fit', '4'),
    ];

    expect(getUniqueCompaniesByBrand(companies).map((item) => item.tradeName)).toEqual([
      'Blue Fit',
      'Smart Fit',
    ]);
  });

  it('ignora diferencas de acento e separacao', () => {
    const companies = [
      company('Tecnofit', '1'),
      company('Tecno Fit São Paulo', '2'),
      company('Sky Fit', '3'),
    ];

    expect(getUniqueCompaniesByBrand(companies).map((item) => item.tradeName)).toEqual([
      'Tecnofit',
      'Sky Fit',
    ]);
  });

  it('deduplica pelas mesmas logo e website nas unidades reais da home', () => {
    const companies: PublicCompanyResponse[] = [
      {
        _id: '1',
        slug: 'tecfit-vieiralves',
        tradeName: 'Tecfit Vieiralves',
        contacts: { website: 'https://tecfit.com.br/' },
        media: { logoUrl: '/images/logo/tecfit.svg' },
      },
      {
        _id: '2',
        slug: 'tecfit-barra-i',
        tradeName: 'Tecfit Barra I',
        contacts: { website: 'https://tecfit.com.br/' },
        media: { logoUrl: '/images/logo/tecfit.svg' },
      },
      {
        _id: '3',
        slug: 'skyfit-americana',
        tradeName: 'Skyfit Academia - Unidade Americana',
        contacts: { website: 'https://skyfitacademia.com.br/' },
        media: { logoUrl: '/images/logo/skyfit.svg' },
      },
      {
        _id: '4',
        slug: 'skyfit-mooca',
        tradeName: 'Skyfit Academia - Unidade Mooca',
        contacts: { website: 'https://skyfitacademia.com.br/' },
        media: { logoUrl: '/images/logo/skyfit.svg' },
      },
      {
        _id: '5',
        slug: 'smartfit-moema',
        tradeName: 'Smartfit Moema',
        contacts: { website: 'https://www.smartfit.com.br/' },
        media: { logoUrl: '/images/logo/smartfit.svg' },
      },
      {
        _id: '6',
        slug: 'bluefit-cidade-nova',
        tradeName: 'Bluefit Academia - Cidade Nova',
        contacts: { website: 'https://bluefitacademia.com.br/' },
        media: { logoUrl: '/images/logo/bluefit.svg' },
      },
      {
        _id: '7',
        slug: 'bluefit-augusto-montenegro',
        tradeName: 'Bluefit Academia Augusto Montenegro',
        contacts: { website: 'https://bluefitacademia.com.br/' },
        media: { logoUrl: '/images/logo/bluefit.svg' },
      },
    ];

    expect(getUniqueCompaniesByBrand(companies).map((item) => item.tradeName)).toEqual([
      'Tecfit Vieiralves',
      'Skyfit Academia - Unidade Americana',
      'Smartfit Moema',
      'Bluefit Academia - Cidade Nova',
    ]);
  });
});
