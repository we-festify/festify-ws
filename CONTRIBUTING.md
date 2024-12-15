# Contributing to Festify Web Services

Thank you for considering contributing to the Festify Web Services! We appreciate your help. Please read the following guidelines before contributing. If you have any questions, feel free to contact us via our Slack Channel.

Be a part of our team by showcasing your passion for open source and your willingness to learn and grow. We are looking for contributors who are respectful, empathetic, and open to feedback. Check open issues and see if you can help with any of them. If you have an idea for a new feature or a bug fix, please create an issue first to discuss it with the maintainers.

## Development setup

- Node.js (v20)
- npm
- Redis (optional, can be run using Docker or RedisLabs)

## How to contribute

## Running locally

To run locally, you need to have Node.js installed on your machine. You can download Node.js from [here](https://nodejs.org/).

After installing Node.js, you can run the services by following the steps below:

1. Follow the instructions in the [README.md](README.md) file to set up the project on your local machine.

2. Make your changes and check if they work:

```bash
# check linting
npm run lint

# check unit tests
npm run test

# check build
npm run build
```

5. Commit your changes:

```bash
git add .
git commit -m "Your commit message"
```

6. Push your changes to the branch: **Important: Do not publish your branch to the main repository.**

```bash
git push origin <your-unique-branch-name>
```

7. Create a pull request on GitHub. Please provide a detailed description of your changes and why you made them.

8. Wait for a maintainer to review your pull request. If there are any changes requested, please make them and push them to the branch.

9. Once your pull request is approved, it will be merged into the main branch.

Don't forget to check the [Code of Conduct](CODE_OF_CONDUCT.md).
