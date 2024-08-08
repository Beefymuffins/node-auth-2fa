# Node Authentication - Login authentication with 2fa

The goal of this project is to implement advanced authentication mechanisms in a Node.js application. The project achieves:

- **Enhanced Security**: Implementing secure authentication practices, including the use of OAuth and JWTs, and secure cookies.
- **Local SSL Configuration**: Setting up a local SSL environment with Caddy Server.
- **User Management**: Handling user registration, login, password management, and profile management with secure storage of credentials.
- **Session Handling**: Managing user sessions effectively with cookies and session tokens.
- **Third-Party Authentication**: Integrating third-party authentication providers (e.g., Google, Facebook) for user login.
- **Email Verification**: Implementing email verification processes, including sending emails and creating verification links.
- **Two-Factor Authentication (2FA)**: Adding an extra layer of security with authenticator-based 2FA.
- **CORS Management**: Understanding and implementing Cross-Origin Resource Sharing (CORS) for secure API interaction.
- **Password Management**: Providing features for password changes, forgotten password flows, and password resets.

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

You will need Node, Npm and Caddy preinstalled before running the program.

- [Caddy](https://caddyserver.com/docs/install)
- node >= 18
- npm

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository and navigate to it

   ```sh
   git clone https://github.com/Beefymuffins/node-auth-2fa.git

   cd node-auth-2fa
   ```

2. Open the UI & API Folders in separate terminal windows and cd into them
   ```sh
   cd ui
   cd api
   ```
3. Install NPM packages (in both terminal windows)

   ```sh
   npm install
   ```

4. Change domain in Caddy File

   ```
   {
        local_certs
   }

    # Change Domain here
    beef.dev {
        reverse_proxy 127.0.0.1:5000
    }

    # Change Domain here
    api.beef.dev {
        reverse_proxy 127.0.0.1:3000
    }
   ```

5. Start the caddy server

   ```sh
     caddy run
   ```

6. Open a server for the UI to run on

   ```sh
   npx server ui
   ```

7. Start the development environment

   API:

   ```sh
    node ./index.js
   ```

8. On the browser, navigate to localhost OR domain set in Caddy file

<!-- Tech Stack -->

## Technology Stack

**Fastify** - Web framework

**Mongodb** - For data storage

**Nodemailer** - For email sending

**otplib** - For 2FA verification

## What I learned from this project:

- How to implement and configure secure cookies to enhance session security
- Configuring the hosts file for local development to manage domain names and IP addresses
- Setting up a local SSL environment using Caddy Server to secure local development with HTTPS
- Structuring a project with separate UI and API layers to improve modularity and maintainability
- Practical implementation of CORS to enable secure cross-origin requests
- Integrating email functionality for user communication and verification
- Generating and handling email verification links to confirm user email addresses
- Routes in express
- How to implement password verification, change and reset
- How to develop a complete forgot password flow, including user interface and server-side logic
- How to create a user interface for two-factor authentication (2FA) setup and use.
- Implementing 2FA login flow to enhance login security with an additional verification step.

---

<!-- CONTACT -->

## Contact

👤 Austin Carles

- Linkedin: [@carlescoding](https://www.linkedin.com/in/carlescoding/)
- Github: [@Beefymuffins](https://github.com/CarlesCoding)

Project Link: [https://github.com/Beefymuffins/node-auth-2fa](https://github.com/CarlesCoding/node-auth-2fa)

<!-- Acknowledgments  -->

## Acknowledgments

- [Level Up Tuts](https://levelup.video/)

<!-- LICENSE -->

## License

Distributed under the MIT License.
