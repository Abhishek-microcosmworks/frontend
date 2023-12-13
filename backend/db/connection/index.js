import mongoose from 'mongoose';
const { MONGO_CONNECTION_POOLSIZE, DATABASE_URL } = process.env;
const options = {
  maxPoolSize: MONGO_CONNECTION_POOLSIZE || 20,
  connectTimeoutMs: 5000,
};

const mongoose_connection = mongoose.createConnection(
  'mongodb+srv://abhishek:raBx30ouDedxm4xM@chatgptblog.y5aby2d.mongodb.net/',
  options,
);
mongoose_connection.on('error', (error) => {
  console.error(`error on ${DATABASE_URL} Error \n${error.message}`);
  throw error.message;
});
mongoose_connection.on('connecting', () => {
  console.info(`connecting -> ${process.env.DATABASE_URL}`);
});

mongoose_connection.on('uninitialized', () => {
  console.info(`uninitialized -> ${process.env.DATABASE_URL}`);
});
mongoose_connection.on('connected', () => {
  console.info(`connected to  -> ${process.env.DATABASE_URL}`);
});
mongoose_connection.on('disconnected', () => {
  console.error(`disconnected -> ${process.env.DATABASE_URL}`);
});
export default mongoose_connection;
