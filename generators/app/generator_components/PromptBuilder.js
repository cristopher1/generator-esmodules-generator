export class PromptBuilder {
  #keywordFormatter
  #options

  constructor(keywordFormatter) {
    this.#keywordFormatter = keywordFormatter
    this.#options = {}
  }

  setOptions(options) {
    this.#options = options
  }

  build() {
    const keywordFormatter = this.#keywordFormatter

    const formatKeywords = (input) => {
      return keywordFormatter.format(input)
    }

    return [
      {
        type: 'input',
        name: 'generatorDescription',
        message: "Project's description",
        when: () =>
          !this.#options.onlyTerminal && !this.#options.generatorDescription,
      },
      {
        type: 'input',
        name: 'generatorHomePageUrl',
        message: 'Project homepage url',
        when: () =>
          !this.#options.onlyTerminal && !this.#options.generatorHomePageUrl,
      },
      {
        type: 'input',
        name: 'authorName',
        message: "Author's name",
        when: () => !this.#options.onlyTerminal && !this.#options.authorName,
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: "Author's email",
        when: () => !this.#options.onlyTerminal && !this.#options.authorEmail,
      },
      {
        type: 'input',
        name: 'authorHomepage',
        message: "Author's homepage",
        when: () =>
          !this.#options.onlyTerminal && !this.#options.authorHomepage,
      },
      {
        type: 'input',
        name: 'urlRepository',
        message: 'Github repository url',
        when: () => !this.#options.onlyTerminal && !this.#options.urlRepository,
      },
      {
        type: 'input',
        name: 'generatorKeywords',
        message: 'Package keywords (comman to split)',
        default: '',
        when: () =>
          !this.#options.onlyTerminal && this.#options.generatorKeywords === '',
        filter: formatKeywords,
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
        when: () => !this.#options.onlyTerminal && !this.#options.runGitInit,
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
        when: () =>
          !this.#options.onlyTerminal && !this.#options.runPackageScripts,
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
        when: () => !this.#options.onlyTerminal && !this.#options.license,
      },
    ]
  }
}
