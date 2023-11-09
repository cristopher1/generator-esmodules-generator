import Generator from 'yeoman-generator'

export default class GeneratorBabel extends Generator {
  writing() {
    this.fs.copy(this.templatePath(`./*`), this.destinationPath(''))
  }
}
