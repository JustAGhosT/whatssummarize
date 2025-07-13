# WhatsApp Monitor Backend

This is the backend service for monitoring WhatsApp groups. It uses Puppeteer to interact with WhatsApp Web and provides a REST API and WebSocket interface for the frontend.

## Features

- **WhatsApp Web Integration**: Real-time monitoring using Puppeteer
- **Real-time Updates**: WebSocket support for instant message delivery
- **RESTful API**: Comprehensive endpoints for group and message management
- **Authentication**: JWT-based secure authentication
- **TypeScript**: Full TypeScript support for type safety
- **Logging**: Comprehensive logging system

## Prerequisites

- Node.js 16+
- npm or yarn
- Chrome/Chromium browser (for Puppeteer)

## Setup

1. Clone the repository and navigate to the backend directory:

   ```bash
   git clone https://github.com/yourusername/whatsapp-monitor.git
   cd whatsapp-monitor/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Available Scripts

- `dev`: Start development server with hot-reload
- `build`: Compile TypeScript to JavaScript
- `start`: Start production server
- `test`: Run tests
- `lint`: Run ESLint
- `format`: Format code with Prettier

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile

### Groups

- `GET /api/groups` - List all groups
- `POST /api/groups` - Create a new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `GET /api/groups/:id/messages` - Get group messages

### Messages

- `GET /api/messages` - List all messages
- `POST /api/messages` - Send a new message
- `GET /api/messages/:id` - Get message details
- `DELETE /api/messages/:id` - Delete message

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT secret key | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `DB_TYPE` | Database type | sqlite |
| `DB_DATABASE` | Database file | database.sqlite |
| `WHATSAPP_HEADLESS` | Run browser in headless mode | false |
| `LOG_LEVEL` | Logging level | info |

## Project Structure

```text
backend/
├── src/
│   ├── api/            # API routes and controllers
│   ├── config/         # Configuration files
│   ├── db/             # Database entities and migrations
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic
│   ├── sockets/        # WebSocket handlers
│   ├── utils/          # Utility functions
│   ├── whatsapp/       # WhatsApp client
│   ├── app.ts          # Express app setup
│   └── index.ts        # Server entry point
├── tests/             # Test files
├── logs/              # Log files
├── .env.example       # Environment variables example
└── package.json
```

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Build the application:

   ```bash
   npm run build
   ```

3. Start the production server:

   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/yourusername/whatsapp-monitor/blob/main/LICENSE) file for details.
