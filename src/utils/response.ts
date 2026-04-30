import { ApiResponse } from '../types';

export const jsonResponse = <T>(
  data: ApiResponse<T>,
  status = 200,
  headers: Record<string, string> = {}
): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
};

export const errorResponse = (
  code: string,
  message: string,
  status = 400,
  headers: Record<string, string> = {}
): Response => {
  return jsonResponse(
    {
      ok: false,
      error: { code, message },
    },
    status,
    headers
  );
};
