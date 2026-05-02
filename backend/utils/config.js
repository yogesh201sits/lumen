// Configuration module
import dotenv from "dotenv";
import { logError } from './logger.js'

dotenv.config();

const requiredEnvVars = ['GROQ_API_KEY', 'SELTZ_API_KEY'];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missing.length > 0) {
    logError(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

export const config = {
  port: process.env.PORT || 3000,
  groqApiKey: process.env.GROQ_API_KEY,
  seltzApiKey: process.env.SELTZ_API_KEY,
};