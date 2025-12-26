require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

swaggerDocument.servers = [
  {
    url: '/api/v1',
    description: 'API',
  },
];
//security packages//////
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


//connect to db
const connectDB = require('./db/connect');

//
const authenticateUser = require('./middleware/authentication');
// routes
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const callCurrencyRouter = require('./routes/callCurrency');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
// extra packages

/// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api/v1/docs">Documentation</a>');
});

// routes
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/currency', callCurrencyRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

/// Variable env configuration
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV} || "local"`
});


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
