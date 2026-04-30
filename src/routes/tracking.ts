import { IRequest } from 'itty-router';
import { Env } from '../types';
import { TrackingRepo } from '../repo/trackingRepo';
import { jsonResponse, errorResponse } from '../utils/response';

export const trackingRoutes = {
  add: async (request: IRequest, env: Env) => {
    try {
      const body = await request.json() as any;
      
      if (!body.tenderId) {
        return errorResponse('BAD_REQUEST', 'tenderId is required');
      }

      const repo = new TrackingRepo(env);
      const success = await repo.add({
        tenderId: body.tenderId,
        title: body.title || '',
        orgName: body.orgName || '',
        endDate: body.endDate || '',
        tenderUrl: body.tenderUrl || ''
      });

      if (success) {
        return jsonResponse({ ok: true });
      } else {
        return errorResponse('SERVER_ERROR', 'Failed to save tracking info', 500);
      }
    } catch (err) {
      return errorResponse('BAD_REQUEST', 'Invalid JSON body');
    }
  },

  list: async (request: IRequest, env: Env) => {
    const repo = new TrackingRepo(env);
    try {
      const items = await repo.getAll();
      return jsonResponse({ ok: true, items });
    } catch (err) {
      return errorResponse('SERVER_ERROR', 'Failed to fetch tracking items', 500);
    }
  },
};
