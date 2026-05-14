/** @jest-environment node */

import { DashboardService } from './dashboard.service';
import { resetMockDb } from '@/tests/mocks/handlers/state';
import { server } from '@/tests/mocks/server';

describe('DashboardService', () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    resetMockDb();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('loads dashboard summary', async () => {
    const response = await DashboardService.summary();

    expect(response.users.total).toBe(3);
    expect(response.users.lastWeek).toBe(3);
    expect(response.companies.total).toBe(1);
    expect(response.jobs.total).toBe(3);
    expect(response.applications.total).toBe(2);
  });
});
