import api from '@client/api';
import authReducer from '@client/store/slices/auth';

const rootReducer = {
  [api.reducerPath]: api.reducer,
  auth: authReducer,
};

export default rootReducer;
