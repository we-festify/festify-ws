export class FwsError extends Error {
  constructor(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${message}`;
    super(formattedMessage);
    this.name = 'FwsError';

    // Capture the stack trace and filter it to exclude package internals
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FwsError);
    }

    // Filter the stack trace to remove internal details
    this.stack = this.filterStack(this.stack);
  }

  private filterStack(stack: string | undefined): string | undefined {
    if (!stack) return undefined;

    // Split the stack into lines and remove lines with internal package paths
    const stackLines = stack.split('\n');
    const filteredLines = stackLines.filter(
      (line) => !line.includes('node_modules') && !line.includes('dist'),
    );

    // Return only the filtered stack or just the message if you want minimal info
    return filteredLines.join('\n');
  }
}
