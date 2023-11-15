import Generator from 'yeoman-generator'

export default class GeneratorSubGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.argument('subGeneratorName', {
      type: String,
      description: "Subgenerator's name",
      required: true,
    })

    this.option('create', {
      type: Boolean,
      description: 'Creates a subgenerator',
      default: false,
    })

    this.option('exports', {
      type: Boolean,
      description: 'Adds a subgenerator to the field exports into package.json',
      default: false,
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
    const { create, exports } = this.options
    const { subGeneratorName } = this.options

    if (create) {
      this.#createSubgenerator(subGeneratorName)
    }

    if (exports) {
      this.#exportSubgenerator(subGeneratorName)
    }
  }
}
