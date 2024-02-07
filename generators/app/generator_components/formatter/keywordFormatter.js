export class KeywordFormatter {
  #baseKeywords

  constructor() {
    this.#baseKeywords = ['yeoman-generator']
  }

  #obtainKeywords(generatorKeywords) {
    generatorKeywords = generatorKeywords.split(',')

    const packageKeywords = this.#baseKeywords.concat(generatorKeywords)

    return packageKeywords
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
  format(generatorKeywords) {
    let packageKeywords = this.#obtainKeywords(generatorKeywords)

    packageKeywords = this.#removeSpacesFromKeywords(packageKeywords)
    packageKeywords = this.#removeEmptyKeyword(packageKeywords)
    packageKeywords = this.#removeRepeatedKeywords(packageKeywords)

    return packageKeywords
  }
}
