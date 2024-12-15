# Festify Web Services

This repository contains the code for the Festify Web Services. The **Festify Web Services** is a set of services developers can use for their projects. The Festify app also uses the services provided in this repository.

## Services

- BES - Basic Email Service

Please check back later for more services.

## Running locally

To run locally, you need to have Node.js installed on your machine. You can download Node.js from [here](https://nodejs.org/).

After installing Node.js, you can run the services by following the steps below:

1. Fork and clone the repository to your local machine using

```bash
git clone https://github.com/<your-github-user-name>/festify-ws.git
```

2. Go to the `apps/server` directory and create a `.env` file with the contents of the `.env.example` file. You can do this by running the following command in the terminal:

```bash
cd apps/server
cp .env.example .env
```

3. Go to the `apps/client` directory and create a `.env` file with the contents of the `.env.example` file. You can do this by running the following command in the terminal:

```bash
cd apps/client
cp .env.example .env
```

4. Run a Redis server on your local machine. You can download Redis from [here](https://redis.io/download).

   - If you are having trouble running Redis on your local machine, you can use the Redis Docker image. You can run the following command in the terminal to run the Redis Docker image:

   ```bash
   docker run -d -p 6379:6379 redis
   ```

   - If you don't want to use Docker, you can use the Redis server provided by RedisLabs. You can create a free account on [RedisLabs](https://redislabs.com/) and create a Redis database.
   - Note: After creating a Redis database on RedisLabs, you will need to edit the eviction policy of the Redis database to `no eviction`. You can do this by going to the Redis database settings on RedisLabs and changing the eviction policy to `no eviction`. This is necessary because the Bull queue used in the BES service requires the Redis database to have the `no eviction` eviction policy.

5. Update the `.env` file in the `apps/server` directory with the Redis server details. You can get the Redis server details from the Redis server you are running on your local machine or from RedisLabs.

6. Install the dependencies for the server and client by running the following command in the terminal:

```bash
cd apps/server
npm install

cd apps/client
npm install
```

7. Run from the root directory:

```bash
npm run dev:server

npm run dev:client
```

## Contributing

If you would like to contribute to the project, please check the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
