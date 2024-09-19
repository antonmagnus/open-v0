
## Getting started

After trying out vercels v0.dev I was inspired to build my own version of it and learn how it works. The app is built using Next.js, Tailwind CSS and Vercel. The app is open-source and available on GitHub.

### Requirements
- Node.js >= 20.5.0
- Docker
- Postgres
- pnpm

### Local setup (Docker)
Step-by-step local setup.

1. git clone https://github.com/antonmagnus/open-v0
2. cd open-v0
3. nvm use 20.5.0
4. pnpm i (install packages)
5. Set environment variables 

For local instance you can run postgress in docker
Edit the compose.yml file to set a password, username and volume location for the database.
Run the following commands to start the database:

```bash
docker-compose up -d
```

Set up a github oath app here https://github.com/settings/applications/new.
For local deployment set the callback url to http://localhost:3000/api/auth
This will give you a client id and secret that you can use for DEV_GITHUB_ID and DEV_GITHUB_SECRET.

For next auth set the NEXTAUTH_URL to the host of the app.
The NEXTAUTH_SECRET can be generated using the following command:

```bash
npx auth secret
```
If you don't have an openAI api key you can follow [this guide](https://platform.openai.com/docs/quickstart) to get one.

Your .env file should now look something like this:

```bash
NEXTAUTH_SECRET=..
NEXTAUTH_URL=http://localhost:3000
DEV_GITHUB_ID=..
DEV_GITHUB_SECRET=..
OPENAI_API_KEY=sk-..
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=mydb
POSTGRES_URL=postgres://username:password@localhost:6500/mydb?connect_timeout=15
POSTGRES_PRISMA_URL=postgres://username:password@localhost:6500/mydb?connect_timeout=15
```


7. Run the app using
```bash
pnpm run dev
```
