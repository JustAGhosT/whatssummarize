import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock auth endpoints
  http.post('/api/auth/signin', async () => {
    return HttpResponse.json({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'test-token',
    }, { status: 200 })
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const body = await request.json() as { email: string; name: string }
    return HttpResponse.json({
      user: { id: '1', email: body.email, name: body.name },
      token: 'test-token',
    }, { status: 201 })
  }),

  // Mock chat endpoints
  http.get('/api/chats', () => {
    return HttpResponse.json([
      { id: '1', title: 'Test Chat 1', lastMessage: 'Hello', updatedAt: '2025-07-13T10:00:00Z' },
      { id: '2', title: 'Test Chat 2', lastMessage: 'Hi there', updatedAt: '2025-07-12T15:30:00Z' },
    ], { status: 200 })
  }),

  http.get('/api/chats/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Chat',
      messages: [
        { id: '1', content: 'Hello', sender: 'User', timestamp: '2025-07-13T10:00:00Z' },
        { id: '2', content: 'Hi there', sender: 'AI', timestamp: '2025-07-13T10:01:00Z' },
      ],
    }, { status: 200 })
  }),

  http.post('/api/chats', async () => {
    return HttpResponse.json({
      id: 'new-chat-id',
      title: 'New Chat',
      messages: [],
    }, { status: 201 })
  }),

  // Mock summary endpoints
  http.post('/api/summarize', async () => {
    return HttpResponse.json({
      summary: 'This is a test summary of the conversation.',
      keyPoints: ['Point 1', 'Point 2', 'Point 3'],
    }, { status: 200 })
  }),

  // Mock upload endpoint
  http.post('/api/upload', async () => {
    return HttpResponse.json({
      success: true,
      filename: 'test-file.txt',
      url: '/uploads/test-file.txt',
    }, { status: 200 })
  }),
]

// Create and export the server instance
export const server = setupServer(...handlers)
