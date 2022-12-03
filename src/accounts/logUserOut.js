import jwt from 'jsonwebtoken';

export async function logUserOut(request, response) {
  try {
    const JWTSignature = process.env.JWT_SIGNATURE;
    const { session } = await import('../session/session.js');

    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      // Delete db record for session
      await session.deleteOne({ sessionToken });
    }
    // Remove Cookies
    response.clearCookie('refreshToken').clearCookie('accessToken');
  } catch (error) {
    console.error(error);
  }
}
