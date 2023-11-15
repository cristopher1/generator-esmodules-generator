import Generator from 'yeoman-generator'

export default class GeneratorTypeScript extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    )
  }
}
