import { SITE_URL } from '@/constants/seo';
import {
  removeUndefinedDeep,
  stripHtml,
  toAbsoluteUrl,
  truncateMetaDescription,
} from './seo.utils';

describe('seo.utils', () => {
  describe('stripHtml', () => {
    it('removes html tags and normalizes whitespace', () => {
      expect(stripHtml('<p>Olá <strong>mundo</strong></p>\n<div>SEO</div>')).toBe(
        'Olá mundo SEO'
      );
    });

    it('returns an empty string for empty html content', () => {
      expect(stripHtml('')).toBe('');
    });
  });

  describe('truncateMetaDescription', () => {
    it('returns the original text when it is within the limit', () => {
      expect(truncateMetaDescription('Descrição curta', 160)).toBe(
        'Descrição curta'
      );
    });

    it('truncates long text at a word boundary and appends an ellipsis', () => {
      expect(
        truncateMetaDescription(
          'Esta é uma descrição longa para validar o corte sem quebrar palavras no meio do caminho.',
          50
        )
      ).toBe('Esta é uma descrição longa para validar o corte…');
    });

    it('truncates even when there are no spaces available', () => {
      expect(truncateMetaDescription('abcdefghij', 6)).toBe('abcde…');
    });

    it('trims whitespace before processing', () => {
      expect(truncateMetaDescription('   texto com espaços   ', 160)).toBe(
        'texto com espaços'
      );
    });
  });

  describe('removeUndefinedDeep', () => {
    it('removes undefined fields from nested objects and arrays', () => {
      expect(
        removeUndefinedDeep({
          title: 'fitematch',
          description: undefined,
          image: {
            url: '/image.png',
            width: undefined,
          },
          tags: ['seo', undefined, 'jobs'],
        })
      ).toEqual({
        title: 'fitematch',
        image: {
          url: '/image.png',
        },
        tags: ['seo', 'jobs'],
      });
    });

    it('preserves null values', () => {
      expect(
        removeUndefinedDeep({
          description: null,
          title: 'ok',
        })
      ).toEqual({
        description: null,
        title: 'ok',
      });
    });
  });

  describe('toAbsoluteUrl', () => {
    it('returns undefined for undefined input', () => {
      expect(toAbsoluteUrl(undefined)).toBeUndefined();
    });

    it('builds an absolute url from a relative path', () => {
      expect(toAbsoluteUrl('/jobs')).toBe(`${SITE_URL}/jobs`);
    });

    it('keeps an absolute url unchanged', () => {
      expect(toAbsoluteUrl('https://example.com/image.png')).toBe(
        'https://example.com/image.png'
      );
    });
  });
});
