import mongo from 'mongodb';
import jwt from 'jsonwebtoken';
import { createTokens } from './tokens.js';

const { ObjectId } = mongo;

const JWTSignature = process.env.JWT_SIGNATURE;
const { ROOT_DOMAIN } = process.env;

export async function getUserFromCookies(request, response) {
  try {
    const { user } = await import('../user/user.js');
    const { session } = await import('../session/session.js');
    // Check access token exist
    if (request?.cookies?.accessToken) {
      // If access token
      const { accessToken } = request.cookies;
      // Decode access token
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature);
      // Return user from the record
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      });
    }
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // Look up session
      const currentSession = await session.findOne({ sessionToken });
      // Confirm session is valid
      if (currentSession.valid) {
        // Look up current user
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId),
        });
        // Refresh tokens
        await refreshTokens(sessionToken, currentUser._id, response);
        // Return current user
        return currentUser;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokens(sessionToken, userId, response) {
  try {
    // Create JWT
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId
    );

    // Set Cookie
    const now = new Date();
    // Get date 30 days in the future
    const refreshExpires = now.setDate(now.getDate() + 30);
    response
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        domain: ROOT_DOMAIN,
        httpOnly: true,
        secure: true, // Use caddy server to allow local host/https on safari server
        expires: refreshExpires,
      })
      .setCookie('accessToken', accessToken, {
        path: '/',
        domain: ROOT_DOMAIN,
        httpOnly: true,
        secure: true,
      });
  } catch (error) {
    console.error(error);
  }
}
