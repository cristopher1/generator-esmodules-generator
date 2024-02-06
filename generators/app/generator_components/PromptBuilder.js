export class PromptBuilder {
  #generatorNameFormatter
  #keywordFormatter
  #options

  constructor(generatorNameFormatter, keywordFormatter) {
    this.#generatorNameFormatter = generatorNameFormatter
    this.#keywordFormatter = keywordFormatter
    this.#options = {}
  }

  setOptions(options) {
    this.#options = options
  }

  build() {
    const generatorNameFormatter = this.#generatorNameFormatter
    const keywordFormatter = this.#keywordFormatter

    const formatGeneratorName = (input) => {
      return generatorNameFormatter.format(input)
    }

    const formatKeywords = (input) => {
      return keywordFormatter.format(input)
    }

    return [
      {
        type: 'input',
        name: 'generatorName',
        message: "Project's name",
        default: this.#options.appname,
        filter: formatGeneratorName,
      },
      {
        type: 'input',
        name: 'generatorDescription',
        message: "Project's description",
        default: '',
      },
      {
        type: 'input',
        name: 'generatorHomePageUrl',
        message: 'Project homepage url',
        default: '',
      },
      {
        type: 'input',
        name: 'authorName',
        message: "Author's name",
        default: '',
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: "Author's email",
        default: '',
      },
      {
        type: 'input',
        name: 'authorHomepage',
        message: "Author's homepage",
        default: '',
      },
      {
        type: 'input',
        name: 'urlRepository',
        message: 'Github repository url',
        default: '',
      },
      {
        type: 'input',
        name: 'generatorKeywords',
        message: 'Package keywords (comman to split)',
        default: '',
        filter: formatKeywords,
      },
      {
        type: 'input',
        name: 'generatorWebsite',
        message: 'Your generator website',
        default: '',
      },
      {
        type: 'list',
        name: 'runGitInit',
        message:
          'Do you want to run git init automatically, then installing the dependencies?',
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        default: true,
      },
      {
        type: 'list',
        name: 'runPackageScripts',
        message: `Do you want to automatically run the scripts that configure the package, then installing the dependencies?`,
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        default: true,
      },
      {
        type: 'list',
        name: 'includeLicense',
        message: 'Do you want to use a lincese for this package?',
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        default: false,
      },
    ]
  }
}
