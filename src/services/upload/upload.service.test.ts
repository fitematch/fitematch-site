/** @jest-environment node */

import { UploadService } from './upload.service';
import { mockDb, resetMockDb } from '@/tests/mocks/handlers/state';
import { server } from '@/tests/mocks/server';

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('UploadService', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    Object.defineProperty(global, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
      writable: true,
    });
    localStorage.clear();
    resetMockDb();
    localStorage.setItem('fitematch.access_token', 'access-token');
  });

  afterEach(() => {
    server.resetHandlers();
    localStorage.clear();
  });

  afterAll(() => {
    server.close();
  });

  it('upload company logo', async () => {
    const file = new File(['company-logo'], 'logo.png', { type: 'image/png' });

    const response = await UploadService.uploadCompanyLogo(file);

    expect(response.url).toBe('/uploads/company-logo/logo.png');
    expect(mockDb.upload.lastUpload).toMatchObject({
      endpoint: '/upload/company-logo',
      fileName: 'logo.png',
      fileType: 'image/png',
    });
    expect(mockDb.upload.lastUpload?.contentType).toContain('multipart/form-data');
  });

  it('upload job cover', async () => {
    const file = new File(['job-cover'], 'cover.png', { type: 'image/png' });

    const response = await UploadService.uploadJobCover(file);

    expect(response.url).toBe('/uploads/job-cover/cover.png');
    expect(mockDb.upload.lastUpload?.endpoint).toBe('/upload/job-cover');
  });

  it('upload resume', async () => {
    const file = new File(['resume-pdf'], 'resume.pdf', {
      type: 'application/pdf',
    });

    const response = await UploadService.uploadResume(file);

    expect(response.url).toBe('/uploads/candidate-resume/resume.pdf');
    expect(mockDb.upload.lastUpload?.endpoint).toBe('/upload/candidate-resume');
  });
});
