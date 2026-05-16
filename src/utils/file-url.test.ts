import { resolveFileUrl } from './file-url';

describe('resolveFileUrl', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  });

  it('retorna vazio quando url não existe', () => {
    expect(resolveFileUrl()).toBe('');
    expect(resolveFileUrl('')).toBe('');
  });

  it('mantém urls absolutas http/https de terceiros', () => {
    expect(resolveFileUrl('http://cdn.site/imagem.png')).toBe('http://cdn.site/imagem.png');
    expect(resolveFileUrl('https://cdn.site/imagem.png')).toBe('https://cdn.site/imagem.png');
  });

  it('mantém blob url', () => {
    expect(resolveFileUrl('blob:arquivo-local')).toBe('blob:arquivo-local');
  });

  it('normaliza assets públicos absolutos do próprio site', () => {
    expect(resolveFileUrl('http://localhost:3000/images/logo/bluefit.svg')).toBe(
      '/images/logo/bluefit.svg',
    );
    expect(resolveFileUrl('https://fitematch.com.br/images/categories/spinning.png')).toBe(
      '/images/categories/spinning.png',
    );
  });

  it('normaliza caminhos com /public/images', () => {
    expect(resolveFileUrl('/public/images/logo/bluefit.svg')).toBe('/images/logo/bluefit.svg');
    expect(resolveFileUrl('http://localhost:3000/public/images/logo/bluefit.svg')).toBe(
      '/images/logo/bluefit.svg',
    );
  });

  it('retorna a url original quando não existe base configurada', () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    expect(resolveFileUrl('/uploads/arquivo.png')).toBe('/uploads/arquivo.png');
  });

  it('resolve usando NEXT_PUBLIC_API_URL removendo barras extras', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000///';
    delete process.env.NEXT_PUBLIC_API_BASE_URL;

    expect(resolveFileUrl('/uploads/arquivo.png')).toBe(
      'http://localhost:4000/uploads/arquivo.png',
    );
  });

  it('resolve usando NEXT_PUBLIC_API_BASE_URL como fallback', () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:5000/';

    expect(resolveFileUrl('uploads/arquivo.png')).toBe('http://localhost:5000/uploads/arquivo.png');
  });
});
