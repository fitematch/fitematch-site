import ApplyEntity from '@/types/entities/apply.entity';

type ApplyIdentifier = string | { _id?: string; id?: string } | null | undefined;

type ApplyApiEntity = Partial<ApplyEntity> & {
  id?: string;
  _id?: string;
  jobId?: ApplyIdentifier;
  userId?: ApplyIdentifier;
};

function normalizeIdentifier(value: ApplyIdentifier): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    return value._id || value.id || '';
  }

  return '';
}

export function normalizeApply(application: ApplyApiEntity): ApplyEntity {
  return {
    ...application,
    _id: normalizeIdentifier(application._id || application.id),
    jobId: normalizeIdentifier(application.jobId),
    userId: normalizeIdentifier(application.userId),
  } as ApplyEntity;
}

export function normalizeApplyList(
  applications: ApplyApiEntity[] | undefined | null,
): ApplyEntity[] {
  return (applications || []).map(normalizeApply);
}
