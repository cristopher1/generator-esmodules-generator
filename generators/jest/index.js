import Generator from 'yeoman-generator'

export default class GeneratorJset extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.argument('generatorName', { type: String, required: true })
  }

  writing() {
    const { generatorName } = this.options

    this.fs.copy(
      this.templatePath('__tests__/helpers/index.js'),
      this.destinationPath('__tests__/helpers/index.js'),
    )

    this.fs.copyTpl(
      this.templatePath('__tests__/index.test.js'),
      this.destinationPath('__tests__/index.test.js'),
      {
        generatorName,
      },
    )

    this.fs.copy(
      this.templatePath('jest.config.js'),
      this.destinationPath('jest.config.js'),
    )
  }
}
