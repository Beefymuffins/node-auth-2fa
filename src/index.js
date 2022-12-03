import './public/env.js';
import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './public/db.js';
import { registerUser } from './accounts/register.js';
import { authorizeUser } from './accounts/authorize.js';
import { logUserIn } from './accounts/logUserIn.js';
import { logUserOut } from './accounts/logUserOut.js';
import { getUserFromCookies } from './accounts/user.js';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
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
        if (userId) {
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
