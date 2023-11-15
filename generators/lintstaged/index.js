import Generator from 'yeoman-generator'

export default class GeneratorLintStaged extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('.lintstagedrc.json'),
      this.destinationPath('.lintstagedrc.json'),
    )
  }
}
