export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    auth: {
      saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
      jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    },
    aws: {
      s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        bucket: process.env.AWS_S3_BUCKET || 'test',
      },
    },
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: process.env.CLOUDINARY_FOLDER || 'test',
    },
    db: {
      name: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: process.env.DB_SYNC === 'true',
      pool: {
        min: parseInt(process.env.DB_POOL_MIN, 10),
        max: parseInt(process.env.DB_POOL_MAX, 10),
      },
      logging: process.env.DB_LOGGING === 'true',
    },
    driver: {
      storage: process.env.STORAGE_DRIVER || 's3',
      payment: process.env.PAYMENT_DRIVER || 'stripe',
    },
    nodeEnv: process.env.NODE_ENV,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      namespace: process.env.REDIS_NAMESPACE || 'default',
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      bullBoard: {
        username: process.env.BULL_BOARD_USERNAME,
        password: process.env.BULL_BOARD_PASSWORD,
      },
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: {
        account: process.env.STRIPE_WEBHOOK_SECRET_ACCOUNT,
        accountTest: process.env.STRIPE_WEBHOOK_SECRET_ACCOUNT_TEST,
      },
    },
    url: {
      base: process.env.BASE_URL,
      passwordReset: process.env.PASSWORD_RESET_URL || 'http://localhost:3000',
      stripe: {
        success: process.env.STRIPE_SUCCESS_URL,
        cancel: process.env.STRIPE_CANCEL_URL,
      },
    },
  };
};
