import dotenv from "dotenv";
dotenv.config();

export const config = {
  database: {
    URI: process.env.DATABASE_URI || "mongodb://localhost:27017/zyra-moments",
  },

  // cors configuration
  cors: {
    ALLOWED_ORIGIN:
      process.env.CORS_ALLOWED_ORIGIN || "https://bellaimagine.salimkm.tech",
  },

  // Server Configuration
  server: {
    HOST: process.env.HOST || "localhost",
    PORT: process.env.PORT || 3002,
    NODE_ENV: process.env.NODE_ENV || "development",
  },

  jwt: {
    ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY || "your-secret-key",
    REFRESH_SECRET_KEY:
      process.env.JWT_REFRESH_SECRET_KEY || "your-refresh-key",
    ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "",
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "",
  },

  isProduction: {
    NODE_ENV: process.env.NODE_ENV || false,
  },

    s3: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
    AWS_BUCKET_NAME : process.env.BUCKET_NAME || '',
  },

  redis : {
    REDIS_USERNAME : process.env.REDIS_USERNAME || '',
    REDIS_PASS : process.env.REDIS_PASS || '',
    REDIS_HOST : process.env.REDIS_HOST || '',
    REDIS_PORT : process.env.REDIS_PORT || '6379',
    REDIS_PRESIGNED_URL_EXPIRY : process.env.REDIS_PRESIGNRED_URL_EXPIRY ? parseInt(process.env.REDIS_PRESIGNRED_URL_EXPIRY, 10) || 86400 : 86400
  }
};
