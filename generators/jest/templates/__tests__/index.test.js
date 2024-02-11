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

      /**
       * Add options to withAnswers, for example: Use a callback function to
       * trigger filter functions used in question objects.
       */
      const options = {
        /**
         * This function is called by withAnswers for each answer.
         *
         * @param {any} answer User entered answer.
         * @param {Object} param
         * @param {any} param.question The question associated with the answer.
         * @param {any} param.answers All user entered answers.
         * @returns
         */
        callback: (answer, { question, answers }) =>
          question.filter ? question.filter(answer) : answer,
      }

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withAnswers(answers, options)
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
