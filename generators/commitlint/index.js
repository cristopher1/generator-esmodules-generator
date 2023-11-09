import Generator from 'yeoman-generator'

export default class GeneratorCommitLint extends Generator {
  writing() {
    this.fs.copy(this.templatePath(`./*`), this.destinationPath(''))
  }
}
