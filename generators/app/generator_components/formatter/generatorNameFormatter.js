export class GeneratorNameFormatter {
  /**
   * @param {string} generatorName The name of the generator.
   * @param {string} [replacer] The String used to replace the whitespaces.
   * @returns The name of the generator with replaced whitespaces.
   */
  #replaceWhiteSpaces(generatorName, replacer = '-') {
    const generatorNameWithoutWhiteSpaces = generatorName.split(' ')
    const generatorNameWithReplacedWhiteSpaces =
      generatorNameWithoutWhiteSpaces.join(replacer)

    return generatorNameWithReplacedWhiteSpaces
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
  format(generatorName) {
    generatorName = this.#replaceWhiteSpaces(generatorName)

    let generatorNameComponents = generatorName.split('-')

    generatorNameComponents = this.#addGeneratorPrefix(generatorNameComponents)

    const formatedGeneratorName = generatorNameComponents.join('-')

    return formatedGeneratorName
  }
}
