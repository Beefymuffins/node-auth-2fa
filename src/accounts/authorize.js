import bcrypt from 'bcryptjs';

const { compare } = bcrypt;

export async function authorizeUser(email, password) {
  // Import User collection
  const { user } = await import('../user/user.js');
  // Look up the user
  const userData = await user.findOne({
    'email.address': email,
  });
  // Get user password
  const savedPassword = userData.password;
  // Compare the password with one in db
  const isAuthorized = await compare(password, savedPassword);
  // Return boolean of if password is correct
  return { isAuthorized, userId: userData._id };
}
