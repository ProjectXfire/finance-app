import { Hono } from 'hono';
import { handle } from 'hono/vercel';
// Routes
import accounts from './(finance)/accounts';
import categories from './(finance)/categories';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app.route('/accounts', accounts).route('/categories', categories);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
