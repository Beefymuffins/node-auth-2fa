import crypto from 'crypto';

const { ROOT_DOMAIN, JWT_SIGNATURE } = process.env;

function createResetToken(email, expTimestamp) {
  try {
    // Auth String JWT Signature, email, expTimestamp
    const authString = `${JWT_SIGNATURE}:${email}:${expTimestamp}`;
    return crypto.createHash('sha256').update(authString).digest('hex');
  } catch (error) {
    console.error(error);
  }
}

export async function createResetEmailLink(email) {
  try {
    // Encode url string
    const URIencodedEmail = encodeURIComponent(email);
    // Create timestamp
    const expTimestamp = Date.now() + 24 * 60 * 60 * 100;
    // Create token
    const token = createResetToken(email, expTimestamp);

    // Link email contains user email, token, expiration date
    return `https://${ROOT_DOMAIN}/reset/${URIencodedEmail}/${expTimestamp}/${token}`;
  } catch (error) {
    console.error(error);
  }
}

export async function createResetLink(email) {
  try {
    const { user } = await import('../user/user.js');
    // Check to see if a user exist with that email
    const foundUser = await user.findOne({
      'email.address': email,
    });

    // If user exists
    if (foundUser) {
      // Create email link
      const link = await createResetEmailLink(email);
      return link;
    }
    return ''; // empty string returns as 'false'
  } catch (error) {
    console.log('error', error);
    return false;
  }
}
