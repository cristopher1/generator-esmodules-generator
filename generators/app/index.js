import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import { GeneratorProvider } from './generator_components/GeneratorProvider.js'
import { PromptBuilder } from './generator_components/PromptBuilder.js'

export default class GeneratorQualityNpmPackage extends Generator {
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
          'generator-quality-npm-package',
        )} generator!`,
      ),
    )

    promptBuilder.setOptions({ appname: this.appname })
    const prompts = promptBuilder.build()

    this.answers = await this.prompt(prompts)
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

  #addBabel(options) {
    const generator = this.#generatorProvider.getBabelGenerator()
    this.composeWith(generator, options)
  }

  #addJest(options) {
    const generator = this.#generatorProvider.getJestGenerator()
    this.composeWith(generator, options)
  }

  #addCommitLint(options) {
    const generator = this.#generatorProvider.getCommitLintGenerator()
    this.composeWith(generator, options)
  }

  #addRollup(options) {
    const generator = this.#generatorProvider.getRollupGenerator()
    this.composeWith(generator, options)
  }

  #addLicense(options) {
    const generator = this.#generatorProvider.getLicenseGenerator()
    this.composeWith(generator, options)
  }

  configuring() {
    const { packageType, includeLicense } = this.answers
    const packageConfig = packageType === 'module' ? { esmodules: true } : {}

    this.#addGit()
    this.#addEslint()
    this.#addHusky()
    this.#addLintStaged()
    this.#addPrettier()
    this.#addTypeScript()

    this.#addBabel(packageConfig)
    this.#addJest(packageConfig)
    this.#addCommitLint(packageConfig)
    this.#addRollup(packageConfig)

    if (includeLicense) {
      const licenseOptions = {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        website: this.answers.authorHomepage,
      }

      this.#addLicense(licenseOptions)
    }
  }

  writing() {
    this.fs.copy(this.templatePath('./**/*'), this.destinationPath(''))
  }

  #getKeywords(packageKeywords) {
    const keywords = packageKeywords.split(',')
    const keywordsWithoutSpaces = keywords.map((elemenet) => {
      return elemenet.trim()
    })

    if (keywordsWithoutSpaces.length === 1 && keywordsWithoutSpaces[0] === '') {
      return []
    }
    return keywordsWithoutSpaces
  }

  conflicts() {
    this.packageJson.merge({
      name: this.answers.packageName,
      description: this.answers.packageDescription,
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
      keywords: this.#getKeywords(this.answers.packageKeywords),
      homepage: this.answers.packageWebsite,
    })

    if (this.answers.packageType === 'module') {
      this.packageJson.merge({
        scripts: {
          test: 'node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose',
        },
      })
    }
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
