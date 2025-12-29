import request from 'supertest';
import app from '../index';
import { tokenManager } from '../utils/tokenManager';
import { rateLimiter } from '../utils/rateLimiter';

describe('POST /api/justify', () => {
  let validToken: string;

  beforeEach(() => {
    tokenManager.clear();
    rateLimiter.clear();
    validToken = tokenManager.generateToken('test@example.com');
  });

  it('should justify text with valid authentication', async () => {
    const text = 'This is a simple test text that needs to be justified.';

    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(text);

    expect(response.status).toBe(200);
    expect(response.type).toBe('text/plain');
    expect(response.text).toBeTruthy();
    expect(response.text.length).toBeGreaterThan(0);
  });

  it('should return justified text with 80 characters per line', async () => {
    const text =
      "Longtemps je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire: Je m'endors.";

    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(text);

    expect(response.status).toBe(200);

    const lines = response.text.split('\n');
    lines.forEach((line, index) => {
      if (index < lines.length - 1) {
        expect(line.length).toBe(80);
      }
    });
  });

  it('should return 401 without authorization header', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send('Some text');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should return 401 with invalid token', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', 'Bearer invalid-token')
      .set('Content-Type', 'text/plain')
      .send('Some text');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 with wrong content type', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'application/json')
      .send({ text: 'Some text' });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Content-Type must be text/plain');
  });

  it('should return 400 with empty text', async () => {
    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send('');

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('cannot be empty');
  });

  it('should return 402 when rate limit is exceeded', async () => {
    const limitedLimiter = new (require('../utils/rateLimiter').RateLimiter)(100);
    const originalLimiter = require('../utils/rateLimiter').rateLimiter;
    require('../utils/rateLimiter').rateLimiter = limitedLimiter;

    const longText = 'word '.repeat(60);

    await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(longText);

    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(longText);

    expect(response.status).toBe(402);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Payment Required');

    require('../utils/rateLimiter').rateLimiter = originalLimiter;
  });

  it('should track word count correctly for rate limiting', async () => {
    const text1 = 'one two three four five';
    const text2 = 'six seven eight nine ten';

    await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(text1);

    const currentCount = rateLimiter.getCurrentCount(validToken);
    expect(currentCount).toBe(5);

    await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(text2);

    const finalCount = rateLimiter.getCurrentCount(validToken);
    expect(finalCount).toBe(10);
  });

  it('should handle multiple line text correctly', async () => {
    const text = 'First line of text.\nSecond line of text.\nThird line of text.';

    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(text);

    expect(response.status).toBe(200);
    expect(response.text).toBeTruthy();
  });

  it('should handle text with special characters', async () => {
    const text = 'Text with special characters: é, à, ç, ô, œ, and punctuation: !?.,;';

    const response = await request(app)
      .post('/api/justify')
      .set('Authorization', `Bearer ${validToken}`)
      .set('Content-Type', 'text/plain')
      .send(text);

    expect(response.status).toBe(200);
    expect(response.text).toContain('é');
  });
});
