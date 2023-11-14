import Generator from 'yeoman-generator'

export default class GeneratorSubGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option('create', {
      type: String,
      description: "Creates a subgenerator using a subgenerator's name",
    })

    this.option('export', {
      type: String,
      description: 'Adds a subgenerator to the field exports into package.json',
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

  #exportSubgenerator(subGeneratorName) {
    const generatorDirName = 'generators'
    const distDirName = 'dist'
    const exportsValue = {}

    exportsValue[`./${subGeneratorName}`] = {
      types: `./${distDirName}/types/${generatorDirName}/${subGeneratorName}/index.d.ts`,
      import: `./${distDirName}/${generatorDirName}/${subGeneratorName}/index.js`,
    }

    this.packageJson.merge({ exports: exportsValue })
  }

  writing() {
    if (this.options.create) {
      const subGeneratorName = this.options.create
      this.#createSubgenerator(subGeneratorName)
    }

    if (this.options.export) {
      const subGeneratorName = this.options.export
      this.#exportSubgenerator(subGeneratorName)
    }
  }
}
