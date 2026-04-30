import { AutoRouter, cors, IRequest } from 'itty-router';
import { Env } from './types';
import { tenderRoutes } from './routes/tenders';
import { trackingRoutes } from './routes/tracking';
import { errorResponse } from './utils/response';

const { preflight, corsify } = cors({
  origin: 'https://tendergo-taiwan.pages.dev',
  allowMethods: 'GET,POST,OPTIONS',
  allowHeaders: 'Content-Type',
});

const router = AutoRouter<IRequest, [Env, ExecutionContext]>();

// Preflight & CORS
router.options('*', preflight);

// Tender Routes
router.get('/api/tenders/search', tenderRoutes.search);
router.get('/api/tenders/:id', tenderRoutes.getById);

// Tracking Routes
router.post('/api/tracking', trackingRoutes.add);
router.get('/api/tracking', trackingRoutes.list);

// Catch-all
router.all('*', () => errorResponse('NOT_FOUND', 'Route not found', 404));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router
      .fetch(request, env, ctx)
      .catch((err) => {
        console.error('Unhandled Router Error:', err);
        return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500);
      })
      .then(corsify);
  },
};
