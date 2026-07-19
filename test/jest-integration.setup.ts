/**
 * Jest setup for integration tests.
 *
 * Suppresses Redis ECONNREFUSED noise from BullMQ when Redis
 * is not available. Modules that need Redis start their own
 * Testcontainers Redis instance locally.
 */
const originalConsoleError: (...args: unknown[]) => void = console.error.bind(
  console,
) as (...args: unknown[]) => void;

console.error = (...args: unknown[]) => {
  const message = args.join(' ');

  if (message.includes('ECONNREFUSED') && message.includes('127.0.0.1:6379')) {
    return;
  }

  originalConsoleError(...args);
};
