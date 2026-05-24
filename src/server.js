import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import notesRoutes from './routes/notesRoutes.js';

import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(logger);

app.use(cors());

app.use(express.json());

app.use('/notes', notesRoutes);

// 404
app.use(notFoundHandler);

// celebrate validation errors
app.use(errors());

// server errors
app.use(errorHandler);

const bootstrap = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

bootstrap();


