/**
 * Returns the default user id configured in environment variables.
 */
export function getDefaultUserId(): string {
  const userId = process.env.DEFAULT_USER_ID;

  if (!userId) {
    throw new Error(
      'DEFAULT_USER_ID is not set. ' +
        'Run: npx prisma db seed, then copy a user UUID into .env',
    );
  }

  return userId;
}
