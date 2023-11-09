import Generator from 'yeoman-generator'

export default class GeneratorTypeScript extends Generator {
  writing() {
    this.fs.copy(this.templatePath('./*'), this.destinationPath(''))
  }
}
