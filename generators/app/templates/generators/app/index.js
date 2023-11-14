import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'

export default class extends Generator {
  #answers

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the glorious ${chalk.red(
          '<%= generatorName %>',
        )} generator!`,
      ),
    )

    const prompts = {
      type: 'input',
      name: 'projectName',
      message: "Project's name",
      default: this.appname,
    }

    this.#answers = await this.prompt(prompts)
  }

  writing() {
    this.fs.copy(this.templatePath('./**/*'), this.destinationPath(''))
  }

  end() {
    const { projectName } = this.#answers

    this.log(`The ${projectName} is ready`)
  }
}
