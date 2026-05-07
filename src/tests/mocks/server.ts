import { setupServer } from '@/tests/mocks/msw-lite';
import { handlers } from '@/tests/mocks/handlers';

export const server = setupServer(...handlers);
