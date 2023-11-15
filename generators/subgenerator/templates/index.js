import Generator from 'yeoman-generator'

export default class extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath('./.gitkeep'),
      this.destinationPath('.gitkeep'),
    )
  }
}
