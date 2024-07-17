import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { getAccounts } from '@/core/finance/services/server';

const app = new Hono().get('/', clerkMiddleware(), getAccounts);

export default app;
