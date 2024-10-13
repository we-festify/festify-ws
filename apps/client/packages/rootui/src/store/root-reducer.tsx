import { api } from '../api';
import authReducer from './auth';

const rootReducer = {
  [api.reducerPath]: api.reducer,
  auth: authReducer,
};

export default rootReducer;
