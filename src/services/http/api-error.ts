export class ApiError extends Error {
  statusCode: number;
  response?: unknown;

  constructor(message: string, statusCode: number, response?: unknown) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}
