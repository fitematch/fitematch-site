import { buildJobSlug } from './slug.utils';

describe('slug.utils', () => {
  describe('buildJobSlug', () => {
    it('builds a normalized slug from multiple parts', () => {
      expect(buildJobSlug(['Personal Trainer', 'São Paulo', 'CLT'])).toBe(
        'personal-trainer-sao-paulo-clt'
      );
    });

    it('ignores null, undefined and empty values', () => {
      expect(buildJobSlug(['Vaga', undefined, null, '', 'Fitness'])).toBe(
        'vaga-fitness'
      );
    });

    it('removes duplicate separators and trims edges', () => {
      expect(buildJobSlug(['  ---Coordenação---  ', '  Musculação  '])).toBe(
        'coordenacao-musculacao'
      );
    });

    it('returns an empty string when no valid part exists', () => {
      expect(buildJobSlug([undefined, null, ''])).toBe('');
    });

    it('keeps numbers in the generated slug', () => {
      expect(buildJobSlug(['Professor 2026', 'Nível 2'])).toBe(
        'professor-2026-nivel-2'
      );
    });
  });
});
