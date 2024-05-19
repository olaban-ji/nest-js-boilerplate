export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 10,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  },
  db: {
    databaseUri: process.env.DATABASE_URI,
  },
});
