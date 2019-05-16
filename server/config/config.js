module.exports = {
  database: `${process.env.NODE_MONGODB_URI}`,
  port: `${process.env.PORT || 3000}`,
  corsOptions: {
    origins: [
      'https://forgeserver.herokuapp.com',
      'http://random-coffee.fun',
      'https://loori-r.github.io',
      'http://localhost:3000',
      'http://127.0.0.1:5500'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  },
  telegramAuth: {
    clientID: `${process.env.NODE_TELEGRAM_ID}`,
    clientSecret: `${process.env.NODE_TELEGRAM_SECRET}`,
    callbackURL:
      'https://forge-development.herokuapp.com/auth/telegram/callback'
  },
  jwtSecret: process.env.NODE_JWT_SECRET,
  telegramBotToken: process.env.NODE_TELEGRAM_TOKEN,
  frontendServer: 'http://random-coffee.fun'
};
