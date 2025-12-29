import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import tokenRouter from './routes/token';
import justifyRouter from './routes/justify';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

app.use('/api', tokenRouter);
app.use('/api', justifyRouter);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Text Justification API',
    endpoints: {
      'POST /api/token': 'Generate authentication token',
      'POST /api/justify': 'Justify text (requires authentication)',
    },
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
