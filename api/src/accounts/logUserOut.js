import jwt from 'jsonwebtoken';

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

export async function logUserOut(request, response) {
  try {
    const { session } = await import('../session/session.js');

    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // Decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWT_SIGNATURE);
      // Delete db record for session
      await session.deleteOne({ sessionToken });
    }
    // Remove Cookies
    const cookieOptions = {
      path: '/',
      domain: ROOT_DOMAIN,
      httpOnly: true,
      secure: true,
    };
    response
      .clearCookie('refreshToken', cookieOptions)
      .clearCookie('accessToken', cookieOptions);
  } catch (error) {
    console.error(error);
  }
}
