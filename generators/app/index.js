import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import { GeneratorProvider } from './generator_components/GeneratorProvider.js'
import { PromptBuilder } from './generator_components/PromptBuilder.js'

export default class GeneratorEsmodulesGenerator extends Generator {
  #promptBuilder
  #generatorProvider

  initializing() {
    this.#promptBuilder = new PromptBuilder()
    this.#generatorProvider = new GeneratorProvider()
  }

  async prompting() {
    const promptBuilder = this.#promptBuilder

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the glorious ${chalk.red(
          'generator-esmodules-generator',
        )} generator!`,
      ),
    )

    promptBuilder.setOptions({ appname: this.appname })
    const prompts = promptBuilder.build()

    this.answers = await this.prompt(prompts)
    this.answers.generatorName = this.#formatGeneratorName(
      this.answers.generatorName,
    )
  }

  #addGit() {
    const generator = this.#generatorProvider.getGitGenerator()
    this.composeWith(generator)
  }

  #addEslint() {
    const generator = this.#generatorProvider.getEslintGenerator()
    this.composeWith(generator)
  }

  #addHusky() {
    const generator = this.#generatorProvider.getHuskyGenerator()
    this.composeWith(generator)
  }

  #addLintStaged() {
    const generator = this.#generatorProvider.getLintStagedGenerator()
    this.composeWith(generator)
  }

  #addPrettier() {
    const generator = this.#generatorProvider.getPrettierGenerator()
    this.composeWith(generator)
  }

  #addTypeScript() {
    const generator = this.#generatorProvider.getTypeScriptGenerator()
    this.composeWith(generator)
  }

  #addBabel() {
    const generator = this.#generatorProvider.getBabelGenerator()
    this.composeWith(generator)
  }

  #addJest(args) {
    const generator = this.#generatorProvider.getJestGenerator()
    this.composeWith(generator, args)
  }

  #addCommitLint() {
    const generator = this.#generatorProvider.getCommitLintGenerator()
    this.composeWith(generator)
  }

  #addLicense(options) {
    const generator = this.#generatorProvider.getLicenseGenerator()
    this.composeWith(generator, options)
  }

  configuring() {
    const { includeLicense } = this.answers

    this.#addGit()
    this.#addEslint()
    this.#addHusky()
    this.#addLintStaged()
    this.#addPrettier()
    this.#addTypeScript()

    this.#addBabel()
    this.#addJest([this.answers.generatorName])
    this.#addCommitLint()

    if (includeLicense) {
      const licenseOptions = {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        website: this.answers.authorHomepage,
      }

      this.#addLicense(licenseOptions)
    }
  }

  #removeEmptyKeyword(keywords) {
    return keywords.filter((element) => {
      return element !== ''
    })
  }

  #removeSpacesFromKeywords(keywords) {
    return keywords.map((elemenet) => {
      return elemenet.trim()
    })
  }

  #removeRepeatedKeywords(keywords) {
    const uniqueKeywords = new Set(keywords)
    return [...uniqueKeywords]
  }

  /**
   * @param {string} generatorKeywords Keywords entered by the user.
   * @returns {Array[string]} Keywords used into package.json.
   */
  #formatKeywords(generatorKeywords) {
    const baseKeywords = ['yeoman-generator']
    const keywords = generatorKeywords.split(',')
    let packageKeywords = baseKeywords.concat(keywords)

    packageKeywords = this.#removeSpacesFromKeywords(packageKeywords)
    packageKeywords = this.#removeEmptyKeyword(packageKeywords)
    packageKeywords = this.#removeRepeatedKeywords(packageKeywords)

    return packageKeywords
  }

  /**
   * If the generator name does not contain the required prefix, this prefix is
   * added.
   *
   * @param {Array[string]} generatorNameComponents Array that contains the
   *   components of the generator name.
   * @returns {Array[string]} The components of the generator name with the
   *   required prefix.
   */
  #addGeneratorPrefix(generatorNameComponents) {
    const prefix = 'generator'
    const start = 0

    if (generatorNameComponents.indexOf(prefix) !== start) {
      generatorNameComponents.unshift(prefix)
    }

    return generatorNameComponents
  }

  /**
   * @param {string} generatorName The generator name entered by the user.
   * @returns {string} The formated generator name.
   */
  #formatGeneratorName(generatorName) {
    let generatorNameComponents = generatorName.split('-')

    generatorNameComponents = this.#addGeneratorPrefix(generatorNameComponents)

    const formatedGeneratorName = generatorNameComponents.join('-')

    return formatedGeneratorName
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('generators/app/index.js'),
      this.destinationPath('generators/app/index.js'),
      {
        generatorName: this.answers.generatorName,
      },
    )
    this.fs.copy(
      this.templatePath('generators/app/templates/index.js'),
      this.destinationPath('generators/app/templates/index.js'),
    )
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
    )
    this.packageJson.merge({
      name: this.answers.generatorName,
      description: this.answers.generatorDescription,
      type: this.answers.packageType,
      author: {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        url: this.answers.authorHomepage,
      },
      repository: {
        url: this.answers.urlRepository,
      },
      bugs: {
        url: this.answers.urlRepository
          ? `${this.answers.urlRepository}/issues`
          : '',
      },
      keywords: this.#formatKeywords(this.answers.generatorKeywords),
      homepage: this.answers.generatorWebsite,
    })
  }

  #runGitInit() {
    console.log('\n********** Run git init command **********\n')
    this.spawnSync('git', ['init'])
  }

  #getDependencyManager(dependencyManagers) {
    for (const dependencyManager of dependencyManagers) {
      this.log(`Find ${dependencyManager}`)
      const isAvailable = this.#dependencyManagerAvailable(dependencyManager)
      if (isAvailable) {
        return dependencyManager
      }
    }
  }

  #dependencyManagerAvailable(name) {
    try {
      this.spawnSync(`${name}`, ['--version'])
      return true
    } catch (err) {
      return false
    }
  }

  #runPackageScripts(dependencyManager) {
    console.log('\n********** Run scripts from package.json **********')
    const scriptArguments = [
      ['init'],
      ['documentation:create'],
      ['test'],
      ['build'],
    ]
    for (const args of scriptArguments)
      this.spawnSync(`${dependencyManager}`, ['run', ...args])
  }

  #runGoodBye() {
    this.log('\n')
    this.log('****************************************************')
    this.log('****************************************************')
    this.log('********                                    ********')
    this.log('******    Thanks for to use this generator    ******')
    this.log('****                                            ****')
    this.log('******     The project structure is ready     ******')
    this.log('********                                    ********')
    this.log('****************************************************')
    this.log('****************************************************')
    this.log('\n')
  }

  end() {
    const dependencyManagers = ['yarn', 'npm']
    const { runGitInit, runPackageScripts } = this.answers

    if (runGitInit) {
      this.#runGitInit()
    }

    if (runPackageScripts) {
      const dependencyManager = this.#getDependencyManager(dependencyManagers)
      this.log(`using ${dependencyManager}`)

      this.#runPackageScripts(dependencyManager)
    }

    this.#runGoodBye()
  }
}
