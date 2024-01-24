import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { faker } from './helpers'
import { beforeAll, jest } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

jest.mock('generator-license/app', () => {
  return helpers.createDummyGenerator()
})

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-esmodules-generator:app', () => {
  describe('create a yeoman generator', () => {
    describe('scaffold a full yeoman generator using ES Modules', () => {
      const answers = {}

      beforeAll(async () => {
        answers.generatorName = faker.string.sample()
        answers.generatorDescription = faker.string.sample()
        answers.generatorHomePageUrl = faker.internet.url()
        answers.authorName = faker.person.fullName()
        answers.authorEmail = faker.internet.email()
        answers.authorHomepage = faker.internet.url()
        answers.urlRepository = faker.internet.url()
        answers.generatorWebsite = faker.internet.url()
        answers.runGitInit = false
        answers.runPackageScripts = false

        await helpers
          .run(path.join(__dirname, '../generators/app'))
          .withPrompts(answers)
      })
      describe('package.json', () => {
        it('Should create a package.json adding the required fields', () => {
          // Assert
          assert.JSONFileContent('package.json', {
            name: `generator-${answers.generatorName}`,
            version: '0.1.0',
            description: answers.generatorDescription,
            type: 'module',
            main: './dist/generators/app/index.js',
            types: './dist/types/generators/app/index.d.ts',
            exports: {
              '.': {
                types: './dist/types/generators/app/index.d.ts',
                import: './dist/generators/app/index.js',
              },
              './app': {
                types: './dist/types/generators/app/index.d.ts',
                import: './dist/generators/app/index.js',
              },
            },
            files: ['dist'],
            author: {
              name: answers.authorName,
              email: answers.authorEmail,
              url: answers.authorHomepage,
            },
            scripts: {
              'init:husky': 'husky install',
              'documentation:create': 'npx readme-md-generator -y',
              init: 'npm run init:husky',
              format: 'prettier --check .',
              'format:fix': 'prettier --write .',
              'format:build-stage': 'prettier --check generators',
              'format:build-stage:fix': 'prettier --write generators',
              lint: 'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs .',
              'lint:fix': 'npm run lint -- --fix',
              'lint:build-stage':
                'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs generators',
              'lint:build-stage:fix': 'npm run lint:build-stage -- --fix',
              'build:clean': 'rimraf dist',
              'build:tsc': 'tsc',
              'build:es6':
                "cross-env NODE_ENV=buildESmodules npx babel generators --config-file ./babel.config.json --out-dir dist/generators --ignore '/**/templates/' --copy-files --include-dotfiles",
              prebuild:
                'npm run lint:build-stage && npm run format:build-stage:fix && npm run build:clean',
              build: 'npm run build:tsc && npm run build:es6',
              test: 'node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose',
              commitlint: 'npx commitlint --edit',
              'lint-staged': 'npx lint-staged',
              prepublishOnly: 'npm run build',
              'quality-check': 'npm run format && npm run lint && npm run test',
            },
            repository: {
              url: answers.urlRepository,
            },
            keywords: ['yeoman-generator'],
            bugs: {
              url: `${answers.urlRepository}/issues`,
            },
            homepage: answers.generatorWebsite,
          })
        })
      })

      describe('babel', () => {
        it('Should generate the babel.config.json file that contains the configuration for ES modules', () => {
          // Assert
          assert.JSONFileContent('babel.config.json', {
            env: {
              buildESmodules: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        esmodules: true,
                      },
                      modules: false,
                    },
                  ],
                ],
                comments: false,
                plugins: [
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      corejs: 3,
                      version: '^7.22.15',
                    },
                  ],
                ],
              },
            },
          })
        })
      })

      describe('commitlint', () => {
        it('Should generate the commitlint.config.js file that uses the "export default" statement', () => {
          // Assert
          assert.fileContent([
            ['commitlint.config.js', 'export default config'],
          ])
        })
      })

      describe('eslint', () => {
        it('Should generate the .eslintignore file with the correct content', () => {
          // Assert
          assert.fileContent([
            ['.eslintignore', 'dist/'],
            ['.eslintignore', 'coverage/'],
          ])
        })

        it('Should generate the .eslintrc.yml file with the correct content', () => {
          // Assert
          assert.fileContent([
            [
              '.eslintrc.yml',
              "extends: ['eslint:recommended', 'standard', 'prettier']",
            ],
            [
              '.eslintrc.yml',
              "parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }",
            ],
          ])
        })
      })

      describe('git', () => {
        it('Should generate the .gitignore file with the correct content', () => {
          // Assert
          assert.fileContent([
            ['.gitignore', 'dist/'],
            ['.gitignore', 'node_modules/'],
            ['.gitignore', 'coverage/'],
          ])
        })
      })

      describe('husky', () => {
        it('Should generate the commit-msg file with the correct content', () => {
          // Assert
          assert.fileContent([
            ['.husky/commit-msg', '#!/usr/bin/env sh'],
            ['.husky/commit-msg', '. "$(dirname -- "$0")/_/husky.sh"'],
            ['.husky/commit-msg', 'npm run commitlint'],
          ])
        })
        it('Should generate the pre-commit file with the correct content', () => {
          // Assert
          assert.fileContent([
            ['.husky/pre-commit', '#!/usr/bin/env sh'],
            ['.husky/pre-commit', '. "$(dirname -- "$0")/_/husky.sh"'],
            ['.husky/pre-commit', 'npm run lint-staged'],
          ])
        })
        it('Should generate the pre-push file with the correct content', () => {
          // Assert
          assert.fileContent([
            ['.husky/pre-push', '#!/usr/bin/env sh'],
            ['.husky/pre-push', '. "$(dirname -- "$0")/_/husky.sh"'],
            ['.husky/pre-push', 'npm run quality-check'],
          ])
        })
      })

      describe('jest', () => {
        it('Should generate the helpers folder', () => {
          // Assert
          assert.fileContent([
            [
              '__tests__/helpers/index.js',
              "import { faker } from '@faker-js/faker",
            ],
            ['__tests__/helpers/index.js', 'faker.seed(17)'],
            ['__tests__/helpers/index.js', 'export { faker }'],
          ])
        })

        it('Should generate the index.test.js file with the correct content', () => {
          // Arrange
          const { generatorName } = answers

          // Assert
          assert.fileContent([
            ['__tests__/index.test.js', "import path, { dirname } from 'path'"],
            ['__tests__/index.test.js', "import { fileURLToPath } from 'url'"],
            ['__tests__/index.test.js', "import { faker } from './helpers'"],
            [
              '__tests__/index.test.js',
              "import { beforeAll } from '@jest/globals'",
            ],
            ['__tests__/index.test.js', "import assert from 'yeoman-assert'"],
            ['__tests__/index.test.js', "import helpers from 'yeoman-test'"],
            [
              '__tests__/index.test.js',
              `describe('${generatorName}:app', () => {`,
            ],
            ['__tests__/index.test.js', "describe('create a project', () => {"],
            [
              '__tests__/index.test.js',
              "it('Should create a index.js file', () => {",
            ],
            [
              '__tests__/index.test.js',
              "it('Should add the correct content into index.js file', () => {",
            ],
          ])
        })

        it('Should generate the jest.config.js file that uses the "export default" statement', () => {
          // Assert
          assert.fileContent([['jest.config.js', 'export default config']])
        })
      })

      describe('lintstaged', () => {
        it('Should generate the .lintstagedrc.json file with the correct content', () => {
          // Assert
          assert.JSONFileContent('.lintstagedrc.json', {
            '*.{js,mjs}': ['eslint --fix', 'prettier --write'],
            '*.json': ['prettier --write'],
          })
        })
      })

      describe('prettier', () => {
        it('Should generate the .prettierignore file with the correct content', () => {
          // Assert
          assert.fileContent([
            ['.prettierignore', 'dist/'],
            ['.prettierignore', 'node_modules/'],
            ['.prettierignore', 'coverage/'],
            ['.prettierignore', 'package*.json'],
          ])
        })
        it('Should generate the .prettierrc.json file with the correct content', () => {
          // Assert
          assert.JSONFileContent('.prettierrc.json', {
            $schema: 'https://json.schemastore.org/prettierrc',
            semi: false,
            tabWidth: 2,
            singleQuote: true,
            printWidth: 80,
            trailingComma: 'all',
            plugins: ['prettier-plugin-jsdoc'],
          })
        })
      })

      describe('typescript', () => {
        it('Should generate the tsconfig.json file', () => {
          // Assert
          assert.file('tsconfig.json')
        })
      })
    })
  })
})
