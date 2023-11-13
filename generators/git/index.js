import Generator from 'yeoman-generator'

export default class GeneratorGit extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('./_gitignore'),
      this.destinationPath('.gitignore'),
    )
  }
}
