const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

const healthCheckDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongo not connected');
  }
  return await mongoose.connection.db.admin().ping();
};

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});


module.exports = {
  connectDB,
  healthCheckDB,
};
