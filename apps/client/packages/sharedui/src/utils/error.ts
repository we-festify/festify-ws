export const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An error occurred';
  }
  if (typeof error === 'string') {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  } else if (Array.isArray(error)) {
    return JSON.stringify(error);
  } else if (typeof error === 'object') {
    if ('data' in error) {
      return getErrorMessage(error.data);
    } else if ('message' in error) {
      return getErrorMessage(error.message);
    } else if ('error' in error) {
      return getErrorMessage(error.error);
    }
  }
  return 'An error occurred';
};
