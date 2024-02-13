import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import { GeneratorProvider } from './generator_components/GeneratorProvider.js'
import { PromptBuilder } from './generator_components/PromptBuilder.js'
import { GeneratorNameFormatter } from './generator_components/formatter/generatorNameFormatter.js'
import { KeywordFormatter } from './generator_components/formatter/keywordFormatter.js'

export default class GeneratorEsmodulesGenerator extends Generator {
  #promptBuilder
  #generatorProvider
  #generatorNameFormatter
  #keywordFormatter

  constructor(args, opts) {
    super(args, opts)

    this.argument('generatorName', {
      type: String,
      description: 'Name of the generator',
      required: true,
    })

    this.option('onlyTerminal', {
      type: Boolean,
      description:
        'If this option is used, the yeoman prompts will not be used when there are missing options. For default this option is not used',
      default: false,
      required: false,
    })

    this.option('generatorDescription', {
      type: String,
      description: 'Description used into package.json',
      required: false,
    })

    this.option('generatorKeywords', {
      type: String,
      description: 'Generator keywords (comman to split)',
      default: '',
      required: false,
    })

    this.option('license', {
      type: String,
      description:
        'Any lincese accepted by generator-license, for example: Apache-2.0, MIT, MPL-2.0 BSD-2-Clause-FreeBSD, BSD-3-Clause, ISC, etc',
      required: false,
    })

    this.option('authorName', {
      type: String,
      description: "Author's name",
      required: false,
    })

    this.option('authorEmail', {
      type: String,
      description: "Author's email",
      required: false,
    })

    this.option('authorHomepage', {
      type: String,
      description: "Author's homepage",
      required: false,
    })

    this.option('urlRepository', {
      type: String,
      description: 'Github repository url',
      required: false,
    })

    this.option('generatorHomePageUrl', {
      type: String,
      description: 'Project homepage url',
      required: false,
    })

    this.option('runGitInit', {
      type: Boolean,
      description:
        'Do you want to run git init automatically, then installing the dependencies?',
      default: false,
      required: false,
    })

    this.option('runPackageScripts', {
      type: Boolean,
      description:
        'Do you want to automatically run the scripts that configure the package, then installing the dependencies?',
      default: false,
      required: false,
    })
  }

  initializing() {
    this.#generatorNameFormatter = new GeneratorNameFormatter()
    this.#keywordFormatter = new KeywordFormatter()
    this.#promptBuilder = new PromptBuilder(this.#keywordFormatter)
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

    promptBuilder.setOptions({ appname: this.appname, ...this.options })
    const prompts = promptBuilder.build()

    const answers = await this.prompt(prompts)

    this.answers = {
      generatorName: this.#generatorNameFormatter.format(
        this.options.generatorName,
      ),
      generatorDescription:
        this.options.generatorDescription || answers.generatorDescription || '',
      generatorHomePageUrl:
        this.options.generatorHomePageUrl || answers.generatorHomePageUrl || '',
      authorName: this.options.authorName || answers.authorName || '',
      authorEmail: this.options.authorEmail || answers.authorEmail || '',
      authorHomepage:
        this.options.authorHomepage || answers.authorHomepage || '',
      urlRepository: this.options.urlRepository || answers.urlRepository || '',
      generatorKeywords:
        answers.generatorKeywords ||
        this.#keywordFormatter.format(this.options.generatorKeywords),
      generatorWebsite:
        this.options.generatorWebsite || answers.generatorWebsite || '',
      runGitInit: this.options.runGitInit || answers.runGitInit,
      runPackageScripts:
        this.options.runPackageScripts || answers.runPackageScripts,
      includeLicense: answers.includeLicense || this.options.license,
      license: this.options.onlyTerminal
        ? this.options.license || 'NO_LICENSE'
        : this.options.license,
    }
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
    const { includeLicense, license } = this.answers

    this.#addGit()
    this.#addEslint()
    this.#addHusky()
    this.#addLintStaged()
    this.#addPrettier()
    this.#addTypeScript()

    this.#addBabel()
    this.#addJest([this.answers.generatorName])
    this.#addCommitLint()

    if (includeLicense && license !== 'NO_LICENSE') {
      const licenseOptions = {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        website: this.answers.authorHomepage,
        license: this.answers.license,
      }

      this.#addLicense(licenseOptions)
    }
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
      keywords: this.answers.generatorKeywords,
      homepage: this.answers.generatorHomePageUrl,
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
      ['format:fix'],
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
