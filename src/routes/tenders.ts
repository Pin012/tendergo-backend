import { IRequest } from 'itty-router';
import { Env } from '../types';
import { PCCService } from '../services/pcc';
import { jsonResponse, errorResponse } from '../utils/response';

export const tenderRoutes = {
  search: async (request: IRequest, env: Env) => {
    const q = request.query.q;
    if (!q || typeof q !== 'string') {
      return errorResponse('BAD_REQUEST', 'q is required', 400);
    }

    const pcc = new PCCService(env);
    try {
      const items = await pcc.search(q);
      return jsonResponse({ ok: true, items });
    } catch (err: any) {
      return errorResponse('SERVER_ERROR', 'Failed to fetch tenders from PCC', 500);
    }
  },

  getById: async (request: IRequest, env: Env) => {
    const id = request.params.id;
    if (!id) return errorResponse('BAD_REQUEST', 'id is required');

    const pcc = new PCCService(env);
    try {
      const item = await pcc.getDetail(id);
      if (!item) {
        return errorResponse('NOT_FOUND', 'tender not found', 404);
      }
      return jsonResponse({ ok: true, item });
    } catch (err: any) {
      return errorResponse('SERVER_ERROR', 'Failed to fetch tender detail', 500);
    }
  },
};
