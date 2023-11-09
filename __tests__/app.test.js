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

describe('generator-quality-npm-package:app', () => {
  describe('Create a package', () => {
    describe('scaffold a full package using commonjs to imports/exports modules', () => {
      const answers = {}

      beforeAll(async () => {
        answers.packageName = faker.string.sample()
        answers.packageDescription = faker.string.sample()
        answers.packageHomePageUrl = faker.internet.url()
        answers.authorName = faker.person.fullName()
        answers.authorEmail = faker.internet.email()
        answers.authorHomepage = faker.internet.url()
        answers.urlRepository = faker.internet.url()
        answers.packageWebsite = faker.internet.url()
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
            name: answers.packageName,
            version: '1.0.0',
            description: answers.packageDescription,
            main: './dist/cjs/index.cjs',
            type: 'commonjs',
            types: './dist/types/index.d.ts',
            exports: {
              types: './dist/types/index.d.ts',
              import: './dist/esm/index.mjs',
              require: './dist/cjs/index.cjs',
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
              'format:build-stage': 'prettier --check src',
              'format:build-stage:fix': 'prettier --write src',
              lint: 'eslint --ext .js,.mjs .',
              'lint:fix': 'npm run lint -- --fix',
              'lint:build-stage': 'eslint --ext .js,.mjs src',
              'lint:build-stage:fix': 'npm run lint:build-stage -- --fix',
              'build:clean': 'rimraf dist',
              'build:clean-dist-tmp': 'rimraf dist/tmp',
              'build:bundle': 'rollup --config',
              'build:tsc': 'tsc',
              prebuild:
                'npm run lint:build-stage && npm run format:build-stage:fix && npm run build:clean',
              build:
                'npm run build:tsc && npm run build:bundle && npm run build:clean-dist-tmp',
              test: 'jest --verbose',
              commitlint: 'npx commitlint --edit',
              'lint-staged': 'npx lint-staged',
              prepublishOnly: 'npm run build',
              'quality-check': 'npm run format && npm run lint && npm run test',
            },
            repository: {
              url: answers.urlRepository,
            },
            keywords: [],
            bugs: {
              url: `${answers.urlRepository}/issues`,
            },
            homepage: answers.packageWebsite,
          })
        })
      })

      describe('babel', () => {
        it('Should generate the babel.config.json file that contains the configuration for commonjs', () => {
          // Assert
          assert.JSONFileContent('babel.config.json', {
            env: {
              test: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        node: 'current',
                      },
                    },
                  ],
                ],
              },
              buildCommonJS: {
                presets: ['@babel/preset-env'],
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
              buildESmodules: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        esmodules: true,
                      },
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
        it('Should generate the commitlint.config.js file that uses the "module.exports" statement', () => {
          // Assert
          assert.fileContent([['commitlint.config.js', 'module.exports']])
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

        it('Should generate the .eslintrc.json file with the correct content', () => {
          // Assert
          assert.JSONFileContent('.eslintrc.json', {
            env: {
              browser: true,
              es2021: true,
            },
            extends: ['eslint:recommended', 'standard', 'prettier'],
            overrides: [
              {
                env: {
                  node: true,
                },
                files: ['.eslintrc.{js,cjs}'],
                parserOptions: {
                  sourceType: 'script',
                },
              },
              {
                files: ['src/**/*.js'],
                extends: ['plugin:jsdoc/recommended'],
                plugins: ['jsdoc'],
                rules: {
                  'jsdoc/tag-lines': 0,
                },
              },
              {
                env: {
                  node: true,
                },
                files: ['__tests__/**/*.js'],
                extends: ['plugin:jest/recommended'],
                plugins: ['jest'],
              },
            ],
            parserOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module',
            },
          })
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
          // Assert
          assert.fileContent([
            ['__tests__/index.test.js', "import { faker } from './helpers'"],
            [
              '__tests__/index.test.js',
              "import { getGreeting } from '../src/index.js'",
            ],
            ['__tests__/index.test.js', "const filePath = 'src/index.js'"],
            [
              '__tests__/index.test.js',
              'describe(`export function getGreeting (${filePath})`, () => {',
            ],
            [
              '__tests__/index.test.js',
              "it('Should return a string that includes the hello word', () => {",
            ],
            ['__tests__/index.test.js', '// Arrange'],
            ['__tests__/index.test.js', 'const string = faker.string.sample()'],
            ['__tests__/index.test.js', '// Act'],
            ['__tests__/index.test.js', 'const result = getGreeting(string)'],
            ['__tests__/index.test.js', '// Assert'],
            ['__tests__/index.test.js', 'expect(result).toMatch(/hello /i)'],
          ])
        })

        it('Should generate the jest.config.js file that uses the "module.exports" statement', () => {
          // Assert
          assert.fileContent([['jest.config.js', 'module.exports = config']])
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

      describe('rollup', () => {
        it('Should generate the rollup.config.mjs file that exports the configuration using "export default" statement', () => {
          // Assert
          assert.fileContent([
            ['rollup.config.mjs', 'export default defineConfig(['],
          ])
        })
      })

      describe('typescript', () => {
        it('Should generate the tsconfig.json file', () => {
          // Assert
          assert.file('tsconfig.json')
        })
      })
    })
    describe('scaffold a full package using ES Modules to imports/exports modules', () => {
      const answers = {}

      beforeAll(async () => {
        answers.packageName = faker.string.sample()
        answers.packageDescription = faker.string.sample()
        answers.packageHomePageUrl = faker.internet.url()
        answers.authorName = faker.person.fullName()
        answers.authorEmail = faker.internet.email()
        answers.authorHomepage = faker.internet.url()
        answers.packageKeywords = 'keyword1, keyword2'
        answers.packageWebsite = faker.internet.url()
        answers.packageType = 'module'
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
            name: answers.packageName,
            version: '1.0.0',
            description: answers.packageDescription,
            main: './dist/cjs/index.cjs',
            type: 'module',
            types: './dist/types/index.d.ts',
            exports: {
              types: './dist/types/index.d.ts',
              import: './dist/esm/index.mjs',
              require: './dist/cjs/index.cjs',
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
              'format:build-stage': 'prettier --check src',
              'format:build-stage:fix': 'prettier --write src',
              lint: 'eslint --ext .js,.mjs .',
              'lint:fix': 'npm run lint -- --fix',
              'lint:build-stage': 'eslint --ext .js,.mjs src',
              'lint:build-stage:fix': 'npm run lint:build-stage -- --fix',
              'build:clean': 'rimraf dist',
              'build:clean-dist-tmp': 'rimraf dist/tmp',
              'build:bundle': 'rollup --config',
              'build:tsc': 'tsc',
              prebuild:
                'npm run lint:build-stage && npm run format:build-stage:fix && npm run build:clean',
              build:
                'npm run build:tsc && npm run build:bundle && npm run build:clean-dist-tmp',
              test: 'node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose',
              commitlint: 'npx commitlint --edit',
              'lint-staged': 'npx lint-staged',
              prepublishOnly: 'npm run build',
              'quality-check': 'npm run format && npm run lint && npm run test',
            },
            repository: {
              url: '',
            },
            keywords: ['keyword1', 'keyword2'],
            bugs: {
              url: '',
            },
            homepage: answers.packageWebsite,
          })
        })
      })

      describe('babel', () => {
        it('Should generate the babel.config.json file that contains the configuration for ES Modules', () => {
          // Assert
          assert.JSONFileContent('babel.config.json', {
            env: {
              buildCommonJS: {
                presets: ['@babel/preset-env'],
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
              buildESmodules: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        esmodules: true,
                      },
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

        it('Should generate the .eslintrc.json file with the correct content', () => {
          // Assert
          assert.JSONFileContent('.eslintrc.json', {
            env: {
              browser: true,
              es2021: true,
            },
            extends: ['eslint:recommended', 'standard', 'prettier'],
            overrides: [
              {
                env: {
                  node: true,
                },
                files: ['.eslintrc.{js,cjs}'],
                parserOptions: {
                  sourceType: 'script',
                },
              },
              {
                files: ['src/**/*.js'],
                extends: ['plugin:jsdoc/recommended'],
                plugins: ['jsdoc'],
                rules: {
                  'jsdoc/tag-lines': 0,
                },
              },
              {
                env: {
                  node: true,
                },
                files: ['__tests__/**/*.js'],
                extends: ['plugin:jest/recommended'],
                plugins: ['jest'],
              },
            ],
            parserOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module',
            },
          })
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
          // Assert
          assert.fileContent([
            ['__tests__/index.test.js', "import { faker } from './helpers'"],
            [
              '__tests__/index.test.js',
              "import { getGreeting } from '../src/index.js'",
            ],
            ['__tests__/index.test.js', "const filePath = 'src/index.js'"],
            [
              '__tests__/index.test.js',
              'describe(`export function getGreeting (${filePath})`, () => {',
            ],
            [
              '__tests__/index.test.js',
              "it('Should return a string that includes the hello word', () => {",
            ],
            ['__tests__/index.test.js', '// Arrange'],
            ['__tests__/index.test.js', 'const string = faker.string.sample()'],
            ['__tests__/index.test.js', '// Act'],
            ['__tests__/index.test.js', 'const result = getGreeting(string)'],
            ['__tests__/index.test.js', '// Assert'],
            ['__tests__/index.test.js', 'expect(result).toMatch(/hello /i)'],
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

      describe('rollup', () => {
        it('Should generate the rollup.config.js file that exports the configuration using "export default" statement', () => {
          // Assert
          assert.fileContent([
            ['rollup.config.js', 'export default defineConfig(['],
          ])
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
