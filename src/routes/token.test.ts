import request from 'supertest';
import app from '../index';
import { tokenManager } from '../utils/tokenManager';

describe('POST /api/token', () => {
  beforeEach(() => {
    tokenManager.clear();
  });

  it('should generate a token for a valid email', async () => {
    const response = await request(app).post('/api/token').send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBe(64);
  });

  it('should return the same token for the same email', async () => {
    const email = 'test@example.com';

    const response1 = await request(app).post('/api/token').send({ email });
    const response2 = await request(app).post('/api/token').send({ email });

    expect(response1.body.token).toBe(response2.body.token);
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app).post('/api/token').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Bad Request');
  });

  it('should return 400 if email is not a string', async () => {
    const response = await request(app).post('/api/token').send({ email: 123 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 if email format is invalid', async () => {
    const response = await request(app).post('/api/token').send({ email: 'invalid-email' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.message).toContain('Invalid email format');
  });

  it('should accept various valid email formats', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'test123@test-domain.com',
    ];

    for (const email of validEmails) {
      const response = await request(app).post('/api/token').send({ email });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    }
  });

  it('should reject invalid email formats', async () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user @example.com',
      'user@example',
    ];

    for (const email of invalidEmails) {
      const response = await request(app).post('/api/token').send({ email });
      expect(response.status).toBe(400);
    }
  });
});
