import { api } from '../api';
import authReducer from './auth';

// analog
import canvasReducer from '@analog-ui/store/canvas';

const rootReducer = {
  [api.reducerPath]: api.reducer,
  auth: authReducer,

  // analog
  canvas: canvasReducer,
};

export default rootReducer;
