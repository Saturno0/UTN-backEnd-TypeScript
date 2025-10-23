import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB = process.env.DB;

export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;