# Contributing to Festify Web Services

Thank you for considering contributing to the Festify Web Services! We appreciate your help. Please read the following guidelines before contributing. If you have any questions, feel free to contact us via our Slack Channel.

Be a part of our team by showcasing your passion for open source and your willingness to learn and grow. We are looking for contributors who are respectful, empathetic, and open to feedback. Check open issues and see if you can help with any of them. If you have an idea for a new feature or a bug fix, please create an issue first to discuss it with the maintainers.

## Development setup

- Node.js (v20)
- npm

## How to contribute

1. (For Internal Teams) Clone the repository to your local machine using

```bash
git clone https://github.com/we-festify/festify-ws.git
```

1. (For External Contributors) Fork the repository to your GitHub account and clone it to your local machine using

```bash
git clone https://github.com/<your-github-user-name>/festify-ws.git
```

2. Create a new branch for your feature or bug fix:

```bash
git checkout -b <your-unique-branch-name>
```

3. Set up the project on your local machine:

```bash
# install dependencies
npm install
```

4. Make your changes and check if they work:

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
