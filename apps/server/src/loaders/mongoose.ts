import * as mongoose from 'mongoose';
import { env } from '../config';

const mongooseLoader = async () => {
  if (env.db.endpoint) {
    return await mongoose.connect(env.db.endpoint);
  }

  const connection = await mongoose.connect(
    `mongodb://${env.db.host}:${env.db.port}/${env.db.name}`,
  );

  return connection.connection.db;
};

export default mongooseLoader;
