import './public/env.js';
import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './public/db.js';
import { registerUser } from './accounts/register.js';
import { authorizeUser } from './accounts/authorize.js';
import { logUserIn } from './accounts/logUserIn.js';
import { logUserOut } from './accounts/logUserOut.js';
import { getUserFromCookies, changePassword } from './accounts/user.js';
import { sendEmail, mailInit } from './mail/index.js';
import {
  createVerifyEmailLink,
  validateVerifyEmail,
} from './accounts/verify.js';
import {
  createResetLink,
  validateResetEmail,
} from './accounts/forgotPassword.js';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    // Test send email
    await mailInit();

    app.register(fastifyCors, {
      origin: [/\.beef.dev/, 'https://beef.dev'],
      credentials: true,
    });

    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
    });

    // Register User Route
    app.post('/api/register', {}, async (request, response) => {
      try {
        const userId = await registerUser(
          request.body.email,
          request.body.password
        );

        // If account creation was successful
        if (userId) {
          const emailLink = await createVerifyEmailLink(request.body.email);
          await sendEmail({
            to: request.body.email,
            subject: 'Verify your email',
            html: `<a href='${emailLink}'>Verify</a>`,
          });

          await logUserIn(userId, request, response);
        }
        response.send({
          data: {
            status: 'SUCCESS',
            userId,
          },
        });
      } catch (error) {
        console.error(error);
        response.send({
          data: {
            status: 'FAILED',
          },
        });
      }
    });

    // Authorize Route
    app.post('/api/authorize', {}, async (request, response) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        );
        if (isAuthorized) {
          await logUserIn(userId, request, response);
          response.send({
            data: {
              status: 'SUCCESS',
              userId,
            },
          });
        }
        response.send({
          data: {
            status: 'FAILED',
          },
        });
      } catch (error) {
        console.error(error);
      }
    });

    // Logout Route
    app.post('/api/logout', {}, async (request, response) => {
      try {
        await logUserOut(request, response);
        response.send({
          data: {
            status: 'SUCCESS',
          },
        });
      } catch (error) {
        console.error(error);
        response.send({
          data: {
            status: 'FAILED',
          },
        });
      }
    });

    app.post('/api/change-password', {}, async (request, response) => {
      try {
        const { oldPassword, newPassword } = request.body;
        // Verify user login
        const user = await getUserFromCookies(request, response);

        if (user?.email?.address) {
          // Compare current logged in user with form too re-auth
          const { isAuthorized, userId } = await authorizeUser(
            user.email.address,
            request.body.oldPassword
          );

          // If user is who they say they are
          if (isAuthorized) {
            // Update password in db
            await changePassword(userId, newPassword);
            return response.code(200).send('It worked!');
          }
        }
        return response.code(401).send();
      } catch (error) {
        return response.code(401).send();
      }
    });

    // Verify Route
    app.post('/api/verify', {}, async (request, response) => {
      try {
        const { token, email } = request.body;
        const isValid = await validateVerifyEmail(token, email);

        if (isValid) {
          return response.code(200).send();
        }
        return response.code(401).send();
      } catch (error) {
        console.error(error);
        return response.code(401).send();
      }
    });

    // ForgotPassword Route
    app.post('/api/forgot-password', {}, async (request, response) => {
      try {
        const { email } = request.body;
        const link = await createResetLink(email);
        // Send email with link
        if (link) {
          await sendEmail({
            to: email,
            subject: 'Reset your password',
            html: `<a href='${link}'>Reset</a>`,
          });
        }
        // Check to see if a user exist with that email
        // If user exists
        // Create email link
        // Link email contains user email, token, expiration date

        return response.code(200).send();
      } catch (error) {
        console.error(error);
        return response.code(401).send();
      }
    });

    // Reset Password Route
    app.post('/api/reset', {}, async (request, response) => {
      try {
        const { email, password, token, time } = request.body;
        const isValid = await validateResetEmail(token, email, time);
        if (isValid) {
          // Find User
          const { user } = await import('./user/user.js');
          const foundUser = await user.findOne({ 'email.address': email });

          // Check make sure there is a user
          if (foundUser._id) {
            // Change Password
            await changePassword(foundUser._id, password);
            return response.code(200).send('Password Updated');
          }
        }

        return response.code(401).send('Reset Failed');
      } catch (error) {
        console.error(error);
        return response.code(401).send();
      }
    });

    app.get('/test', {}, async (request, response) => {
      try {
        // Verify user login
        const user = await getUserFromCookies(request, response);
        // Return user email, if it exist, otherwise return unauthorized
        if (user?._id) {
          response.send({
            data: user,
          });
        } else {
          response.send({
            data: 'User Lookup Failed.',
          });
        }
      } catch (error) {
        throw new Error(error);
      }
    });

    await app.listen({ port: 3000 });
    console.log('✔️ Server Listening at port: 3000');
  } catch (e) {
    console.error(e);
  }
}

connectDb().then(() => {
  startApp();
});
