export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && 'data' in error) {
    const data = (error as { data: { message: string } }).data;
    return data.message;
  }

  return 'Something went wrong';
};
