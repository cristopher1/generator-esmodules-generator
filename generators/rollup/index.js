import Generator from 'yeoman-generator'

export default class GeneratorRollup extends Generator {
  writing() {
    this.fs.copy(this.templatePath(`./*`), this.destinationPath(''))
  }
}
