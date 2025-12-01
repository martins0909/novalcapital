import { Request } from 'express';
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
      file?: Multer.File;
      email?: string;
    }
  }
}

declare module 'multer';
