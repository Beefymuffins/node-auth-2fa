import https from 'https';
import { fastify } from 'fastify';
import fetch from 'cross-fetch';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
    });

    app.get('/reset/:email/:exp/:token', {}, async (request, response) =>
      response.sendFile('reset.html')
    );

    app.get('/2fa', {}, async (request, response) =>
      response.sendFile('2fa.html')
    );

    app.get('/verify/:email/:token', {}, async (request, response) => {
      try {
        const { email, token } = request.params;

        const values = {
          email,
          token,
        };

        const httpsAgent = new https.Agent({ rejectUnauthorized: false });

        const res = await fetch('https://api.beef.dev/api/verify', {
          method: 'POST',
          body: JSON.stringify(values),
          credentials: 'include',
          agent: httpsAgent,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });

        if (res.status === 200) {
          return response.redirect('/');
        }

        response.code(401).send();
      } catch (error) {
        console.error(error);
        response.code(401).send();
      }
    });

    const PORT = 5000;
    await app.listen({ port: PORT });
    console.log(`✔️ Server Listening at port: ${PORT}`);
  } catch (error) {
    console.log(error);
  }
}

startApp();
