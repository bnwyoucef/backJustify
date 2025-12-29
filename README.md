# Text Justification API

A robust REST API built with Node.js and TypeScript that justifies text to 80 characters per line, featuring token-based authentication and rate limiting.

## Features

- 📝 **Text Justification**: Justifies text to exactly 80 characters per line
- 🔐 **Token-Based Authentication**: Secure API access using bearer tokens
- ⏱️ **Rate Limiting**: 80,000 words per day per token
- ✅ **Comprehensive Testing**: 96%+ code coverage with unit and integration tests
- 🚀 **TypeScript**: Fully typed for better developer experience
- 📊 **No External Dependencies**: Custom text justification algorithm

## API Endpoints

### POST /api/token

Generate an authentication token.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "token": "generated-token-string"
}
```

**Status Codes:**

- `200 OK`: Token generated successfully
- `400 Bad Request`: Invalid or missing email

### POST /api/justify

Justify text to 80 characters per line.

**Headers:**

```
Authorization: Bearer <your-token>
Content-Type: text/plain
```

**Request Body:**

```
Plain text to be justified...
```

**Response:**

```
Justified text with each line
padded to exactly 80 characters
except the last line...
```

**Status Codes:**

- `200 OK`: Text justified successfully
- `400 Bad Request`: Invalid content type or empty body
- `401 Unauthorized`: Missing or invalid token
- `402 Payment Required`: Rate limit exceeded (80,000 words/day)

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd tictactrip
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
PORT=3000
NODE_ENV=development
TOKEN_SECRET=your-secret-key-change-this-in-production
RATE_LIMIT_WORDS_PER_DAY=80000
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

Build the project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

### Running Tests

Run all tests with coverage:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Example Usage

### 1. Generate a Token

```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

Response:

```json
{
  "token": "abc123def456..."
}
```

### 2. Justify Text

```bash
curl -X POST http://localhost:3000/api/justify \
  -H "Authorization: Bearer abc123def456..." \
  -H "Content-Type: text/plain" \
  -d "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire: Je m'endors."
```

Response:

```
Longtemps,  je  me  suis  couché  de  bonne heure. Parfois, à peine ma bougie
éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire:
Je m'endors.
```

### Why In-Memory Storage?

For this implementation, I chose in-memory storage for simplicity and performance:

- Fast access times
- No external dependencies
- Suitable for demonstration purposes

## License

MIT

## Author

Youcefbnw, Built for TicTacTrip technical assessment
