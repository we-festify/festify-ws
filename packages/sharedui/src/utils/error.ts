export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data: { message: string } }).data;
    return data.message;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return `${error.message}`;
  }

  return 'Something went wrong';
};
