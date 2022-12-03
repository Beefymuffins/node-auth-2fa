import { randomBytes } from 'crypto';

export async function createSession(userId, connection) {
  try {
    // Gen a session token
    const sessionToken = randomBytes(43).toString('hex');
    // Retrieve connection information
    const { ip, userAgent } = connection;
    // Database insert for session
    const { session } = await import('../session/session.js');

    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    // Return session token
    return sessionToken;
  } catch (error) {
    throw new Error('Session Creation Failed');
  }
}
