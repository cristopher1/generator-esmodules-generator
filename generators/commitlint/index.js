import Generator from 'yeoman-generator'

export default class GeneratorCommitLint extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('commitlint.config.js'),
      this.destinationPath('commitlint.config.js'),
    )
  }
}
