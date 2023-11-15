import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { faker } from './helpers'
import { beforeAll } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('<%- generatorName %>:app', () => {
  describe('create a project', () => {
    const answers = {}

    beforeAll(async () => {
      answers.projectName = faker.string.sample()

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts(answers)
    })

    it('Should create a index.js file', () => {
      // Assert
      assert.file('src/index.js')
    })

    it('Should add the correct content into index.js file', () => {
      // Assert
      assert.fileContent([
        ['src/index.js', 'const getGreeting = (string) => `hello ${string}`'],
        ['src/index.js', 'export { getGreeting }'],
      ])
    })
  })
})
