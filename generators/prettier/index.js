import Generator from 'yeoman-generator'

export default class GeneratorEslint extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('.prettierignore'),
      this.destinationPath('.prettierignore'),
    )
    this.fs.copy(
      this.templatePath('.prettierrc.json'),
      this.destinationPath('.prettierrc.json'),
    )
  }
}
