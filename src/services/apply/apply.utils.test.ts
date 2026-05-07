import {
  normalizeApply,
  normalizeApplyList,
} from './apply.utils';
import { ApplicationStatusEnum } from '@/types/entities/apply.entity';

describe('apply.utils', () => {
  describe('normalizeApply', () => {
    it('normalizes ids coming as nested objects', () => {
      expect(
        normalizeApply({
          id: 'apply-1',
          jobId: { _id: 'job-1' } as never,
          userId: { id: 'user-1' } as never,
          status: ApplicationStatusEnum.APPLIED,
        })
      ).toEqual({
        id: 'apply-1',
        _id: 'apply-1',
        jobId: 'job-1',
        userId: 'user-1',
        status: ApplicationStatusEnum.APPLIED,
      });
    });

    it('preserves extra fields such as user and details', () => {
      expect(
        normalizeApply({
          _id: 'apply-2',
          jobId: 'job-2',
          userId: 'user-2',
          status: ApplicationStatusEnum.SHORTLISTED,
          user: {
            name: 'Rebeca Chambers',
            birthday: '1980-02-03',
            resumeUrl: '/resume.pdf',
          },
          details: {
            jobTitle: 'Personal Trainer',
          },
        })
      ).toEqual({
        _id: 'apply-2',
        jobId: 'job-2',
        userId: 'user-2',
        status: ApplicationStatusEnum.SHORTLISTED,
        user: {
          name: 'Rebeca Chambers',
          birthday: '1980-02-03',
          resumeUrl: '/resume.pdf',
        },
        details: {
          jobTitle: 'Personal Trainer',
        },
      });
    });

    it('returns empty strings for missing identifiers', () => {
      expect(
        normalizeApply({
          status: ApplicationStatusEnum.REJECTED,
          jobId: null as never,
          userId: undefined,
        })
      ).toEqual({
        _id: '',
        jobId: '',
        userId: '',
        status: ApplicationStatusEnum.REJECTED,
      });
    });
  });

  describe('normalizeApplyList', () => {
    it('normalizes every item from the list', () => {
      expect(
        normalizeApplyList([
          {
            _id: 'apply-1',
            jobId: { id: 'job-1' } as never,
            userId: { _id: 'user-1' } as never,
            status: ApplicationStatusEnum.APPLIED,
          },
          {
            id: 'apply-2',
            jobId: 'job-2',
            userId: 'user-2',
            status: ApplicationStatusEnum.HIRED,
          },
        ])
      ).toEqual([
        {
          _id: 'apply-1',
          jobId: 'job-1',
          userId: 'user-1',
          status: ApplicationStatusEnum.APPLIED,
        },
        {
          id: 'apply-2',
          _id: 'apply-2',
          jobId: 'job-2',
          userId: 'user-2',
          status: ApplicationStatusEnum.HIRED,
        },
      ]);
    });

    it('returns an empty array for undefined input', () => {
      expect(normalizeApplyList(undefined)).toEqual([]);
    });

    it('returns an empty array for null input', () => {
      expect(normalizeApplyList(null)).toEqual([]);
    });
  });
});
