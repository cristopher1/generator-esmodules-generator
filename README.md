<h1 align="center">Welcome to generator-esmodules-generator 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.6-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-%3E%3D%204.0.0-blue.svg" />
  <a href="https://github.com/cristopher1/generator-esmodules-generator#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/cristopher1/generator-esmodules-generator/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/cristopher1/generator-esmodules-generator/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/cristopher1/generator-esmodules-generator" />
  </a>
</p>

> Yeoman generator to create yeoman generators based in ES Modules.

### 🏠 [Homepage](https://github.com/cristopher1/generator-esmodules-generator)

The `generator-esmodules-generator` provides a structure to create a yeoman generator using ES Modules.

The structure created by this generator includes:

- [Jest](https://jestjs.io/)
- [Babel](https://babeljs.io/) with [@babel/cli](https://babeljs.io/docs/babel-cli), [@babel/core](https://babeljs.io/docs/babel-core),
  [@babel/plugin-transform-runtime](https://babeljs.io/docs/babel-plugin-transform-runtime), [@babel/preset-env](https://babeljs.io/docs/babel-preset-env),
  [@babel/runtime-corejs3](https://www.npmjs.com/package/@babel/runtime-corejs3) and [core-js](https://www.npmjs.com/package/core-js)
- [Eslint](https://eslint.org/) with [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier), [eslint-config-standard](https://www.npmjs.com/package/eslint-config-standard),
  [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest), [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc), etc.
- [Prettier](https://prettier.io/) with [prettier-plugin-jsdoc](https://www.npmjs.com/package/prettier-plugin-jsdoc)
- [Lint-staged](https://www.npmjs.com/package/lint-staged)
- [Faker](https://fakerjs.dev/)
- [Commitlint](https://commitlint.js.org/#/)
- [Readme-md-generator](https://github.com/kefranabg/readme-md-generator)
- [Husky](https://www.npmjs.com/package/husky)
- Others

Example of a generator created by `generator-esmodules-generator`:

![Captura de pantalla (10)](https://github.com/cristopher1/generator-esmodules-generator/assets/21159930/91f6dc7a-8160-46de-882e-1776490131fc)

### [Index](#index)

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [The configuration files](#configuration-files)
- [The scripts in package.json](#scripts)
- [Getting To Know Yeoman](#know-yeoman)
- [Author](#author)
- [Contributing](#contributing)
- [Show your support](#support)
- [License](#license)

## <a id="prerequisites"></a> Prerequisites

- npm >= 4.0.0

## <a id="installation"></a> Installation

First, install [Yeoman](http://yeoman.io) and generator-esmodules-generator using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-esmodules-generator
```

Then generate your new project:

```bash
yo esmodules-generator
```

## <a id="configuration-files"></a> The configuration files

The configuration files included are:

- Eslint: `.eslintignore` (the files and directories ignored by eslint) and `.eslintrc.json` (configuration used by eslint).
- Git: `.gitignore` (the files and directories ignored by git).
- Lint-staged: `.lintstagedrc.json` (configuration used by lint-staged).
- Prettier: `.prettierignore` (the files and directories ignored by prettier) and `.prettierrc.json` (configuration used by prettier).
- Babel: `babel.config.json` (configuration used by babel):

  - The `env.buildCommonjs` contains the configuration used to transpile the source code to es5.

  - The `env.buildESmodules` contains the configuration used to transpile the source code to es6.

- Commitlint: `commitlint.config.js` (configuration used by commitlint).

- Jest: `jest.config.js` (configuration used by jest).

- TypeScript: `tsconfig.json` (configuration used by TypeScript compiler).

## <a id="scripts"></a> The scripts in package.json

The more important scripts added into the package.json created by this generator are:

- `"init"`: Runs the commands necessary to initialize the package, for example `init:husky`. It executed automatically when `Do you want to automatically run the scripts that configure the package, then installing the dependencies?` is yes.
- `"documentation:create"`: Creates documentation using readme-md-generator. It executed automatically when `Do you want to automatically run the scripts that configure the package, then installing the dependencies?` is yes.
- `"format"`: Checks the format using prettier.
- `"format:fix"`: Fixes the format using prettier.
- `"format:build-stage"` and `"format:build-stage:fix"`: similar to `"format"` and `"format:fix"`. They used when the `npm run build` is called.
- `"lint"`: static code analysis using eslint.
- `"lint:fix"`: Fixes the code using eslint.
- `"lint:build-stage"` and `"lint:build-stage:fix"`: similar to `"lint"` and `"lint:fix"`. They are used when the `npm run build` is called.
- `"build:tsc"`: Generates .d.ts files using the TypeScript compilator. It is used when the `npm run build` is called.
- `"build:es5"`: Transpiles the source code to es5 using babel.
- `"build:es6"`: Transpiles the source code to es6 using babel.
- `"build"`: Generates the dist folder, that contains the cjs folder (source code transpiled to es5), the esm folder (source code transpiled to es6), and types folder (it contains the declaration files).
- `"prepublishOnly"`: Used before publishing your package using `npm publish`. Runs `npm run build`.
- `"test"`: Runs the tests using jest.
- `"commitlint"`: Runs commitlint. It is used into .husky/commit-msg file. It is called by the commit-msg hook. See [git hook](https://www.atlassian.com/git/tutorials/git-hooks#:~:text=The%20commit%2Dmsg%20hook%20is,file%20that%20contains%20the%20message.).
- `"lint-staged"`: Runs lint-staged. It is used into .husky/pre-commit file. It is called by the pre-commit hook. See [git hook](https://www.atlassian.com/git/tutorials/git-hooks#:~:text=The%20commit%2Dmsg%20hook%20is,file%20that%20contains%20the%20message.).
- `"quality-check"`: Runs `npm run format && npm run lint && npm run test`. It is used into .husky/pre-push file. It is called by the pre-push hook See [git hook](https://www.atlassian.com/git/tutorials/git-hooks#:~:text=The%20commit%2Dmsg%20hook%20is,file%20that%20contains%20the%20message.).

## <a id="know-yeoman"></a> Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).

## <a id="author"></a> Author

👤 **Cristopher Jiménez**

- Github: [@cristopher1](https://github.com/cristopher1)

## <a id="contributing"></a> 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/cristopher1/generator-esmodules-generator/issues).

## <a id="support"></a> Show your support

Give a ⭐️ if this project helped you!

## <a id="license"></a> 📝 License

Copyright © 2023 [Cristopher Jiménez](https://github.com/cristopher1).<br />
This project is [MIT](https://github.com/cristopher1/generator-esmodules-generator/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
