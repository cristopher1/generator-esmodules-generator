import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { beforeAll } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-esmodules-generator:subgenerator', () => {
  const subGeneratorName = 'subGenerator'

  describe('--create', () => {
    beforeAll(async () => {
      await helpers
        .run(path.join(__dirname, '../generators/subgenerator'))
        .withArguments([subGeneratorName])
        .withOptions({ create: true })
    })

    it('Should create a new generator', async () => {
      // Assert
      assert.file([
        `generators/${subGeneratorName}/index.js`,
        `generators/${subGeneratorName}/templates/.gitkeep`,
      ])
    })

    it('Should generate the index.js file with the "export default class extends Generator {" statement', () => {
      // Assert
      assert.fileContent([
        [
          `generators/${subGeneratorName}/index.js`,
          'export default class extends Generator {',
        ],
      ])
    })
  })

  describe('--exports', () => {
    beforeAll(async () => {
      await helpers
        .run(path.join(__dirname, '../generators/subgenerator'))
        .withArguments([subGeneratorName])
        .withOptions({ exports: true })
    })

    it('Should add to the field exports into package.json the information associated to a generator', async () => {
      // Arrange
      const exports = {}

      exports[`./${subGeneratorName}`] = {
        types: `./dist/types/generators/${subGeneratorName}/index.d.ts`,
        import: `./dist/generators/${subGeneratorName}/index.js`,
      }

      // Assert
      assert.jsonFileContent('package.json', {
        exports,
      })
    })
  })
})
