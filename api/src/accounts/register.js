import bcrypt from 'bcryptjs';

const { genSalt, hash } = bcrypt;

export async function registerUser(email, password) {
  // Dynamic import of user, so it doesn't try to load db until needed
  const { user } = await import('../user/user.js');

  // Gen Salt
  const salt = await genSalt(10);

  // Hash with Salt
  const hashedPassword = await hash(password, salt);

  // Store in DB
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPassword,
  });

  // Return user from DB
  return result.insertedId;
}
