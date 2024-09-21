## Getting Started with Your Own Version of V0.dev

Inspired by Vercel's [v0.dev](https://v0.dev), I built my own version to explore how it works and learn from the process. The app is constructed using **Next.js**, **Tailwind CSS**, and **Vercel**, providing a streamlined and scalable approach for experimentation. For an in-depth look at the codebase and project details, check out the [project post](https://www.antonmagnusson.se/projects/openv0).

If you'd prefer not to go through the setup process, you can access a deployed version directly at [v0.antonmagnusson.se](https://v0.antonmagnusson.se).

### Prerequisites

Before setting up the project locally, ensure you have the following installed:

- **Node.js** (version >= 20.5.0)
- **Docker** (for containerized database management)
- **Postgres** (as the primary database)
- **pnpm** (as the package manager)

### Local Setup with Docker

Follow these steps to set up the app locally.

#### 1. Clone the Repository

Start by cloning the project repository from GitHub:

```bash
git clone https://github.com/antonmagnus/open-v0
```

#### 2. Navigate to the Project Directory

Move into the project directory:

```bash
cd open-v0
```

#### 3. Use the Correct Node.js Version

Ensure you’re using Node.js version 20.5.0:

```bash
nvm use 20.5.0
```

If you don’t have this version installed, you can install it using `nvm`:

```bash
nvm install 20.5.0
```

#### 4. Install Dependencies

Install the necessary packages using **pnpm**:

```bash
pnpm i
```

#### 5. Configure Environment Variables

You’ll need to configure environment variables to connect your local setup to the required services.

##### Postgres Setup

You can run Postgres in Docker. Edit the `docker-compose.yml` file to define your preferred **username**, **password**, and **database**. After that, run the following command to start the database:

```bash
docker-compose up -d
```

##### GitHub OAuth Setup

Set up a GitHub OAuth app by visiting [GitHub Applications](https://github.com/settings/applications/new). For local deployment, the callback URL should be:

```
http://localhost:3000/api/auth
```

This setup will provide you with a **Client ID** and **Client Secret**, which you’ll need to populate the `DEV_GITHUB_ID` and `DEV_GITHUB_SECRET` variables.

##### NextAuth Setup

For NextAuth configuration, set the `NEXTAUTH_URL` to your local app host:

```
http://localhost:3000
```

To generate the `NEXTAUTH_SECRET`, use:

```bash
npx auth secret
```

##### OpenAI API Key

If your project requires OpenAI integration, you can obtain an API key by following [this guide](https://platform.openai.com/docs/quickstart).

#### 6. Configure the .env File

Your `.env` file should be structured as follows:

```bash
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
DEV_GITHUB_ID=your_github_client_id
DEV_GITHUB_SECRET=your_github_client_secret
OPENAI_API_KEY=your_openai_api_key
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_database_name
POSTGRES_URL=postgres://your_postgres_username:your_postgres_password@localhost:6500/your_database_name?connect_timeout=15
POSTGRES_PRISMA_URL=postgres://your_postgres_username:your_postgres_password@localhost:6500/your_database_name?connect_timeout=15
```

Ensure all fields are filled with the correct credentials.

#### 7. Start the Application

Once you’ve set up your environment variables and installed the dependencies, run the application locally using:

```bash
pnpm run dev
```

This will start the development server, and the app will be available at `http://localhost:3000`.

### Additional Notes

This project and post were created to highlight the underlying concepts used in building code-augmenting apps, demonstrating how easily LLMs can be integrated into workflows to generate, preview, and refine code. As these models evolve, they will continue to streamline development, making once complex tasks feel effortless.

However, this is just the beginning. There are already more product-ready tools such as [Replit](https://replit.com/), [Vercel’s v0.dev](https://v0.dev/chat), and [Lovable’s GPT Engineer](https://lovable.dev/gpt-engineer/), which take these concepts even further.