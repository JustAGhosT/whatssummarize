import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const handlers = [
  // Mock auth endpoints
  rest.post('/api/auth/signin', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'test-token',
      })
    );
  }),

  rest.post('/api/auth/signup', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        user: { id: '1', email: req.body.email, name: req.body.name },
        token: 'test-token',
      })
    );
  }),

  // Mock chat endpoints
  rest.get('/api/chats', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', title: 'Test Chat 1', updatedAt: new Date().toISOString() },
        { id: '2', title: 'Test Chat 2', updatedAt: new Date().toISOString() },
      ])
    );
  }),

  rest.post('/api/chats', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '3',
        title: 'New Chat',
        content: 'Test content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),

  // Mock summarization endpoint
  rest.post('/api/summarize', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        summary: 'This is a test summary of the chat conversation.',
        keyPoints: [
          'Key point 1',
          'Key point 2',
          'Key point 3',
        ],
      })
    );
  }),
];

export const server = setupServer(...handlers);
