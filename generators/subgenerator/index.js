import Generator from 'yeoman-generator'

export default class GeneratorSubGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option('create', {
      type: String,
      description: "subgenerator's name",
    })
  }

  #createSubgenerator(subGeneratorName) {
    this.fs.copy(
      this.templatePath('./templates/.gitkeep'),
      this.destinationPath(`generators/${subGeneratorName}/templates/.gitkeep`),
    )
    this.fs.copy(
      this.templatePath('./index.js'),
      this.destinationPath(`generators/${subGeneratorName}/index.js`),
    )
  }

  writing() {
    if (this.options.create) {
      const subGeneratorName = this.options.create
      this.#createSubgenerator(subGeneratorName)
    }
  }
}
