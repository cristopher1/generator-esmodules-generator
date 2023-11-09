/**
 * A function to generate a message that includes the hello word.
 *
 * @example
 *   const string = 'world'
 *
 *   const greeting = getGreeting(string)
 *
 *   console.log(greeting)
 *
 * @param {string} string A string used to generate the message.
 * @returns {string} A string that contains the hello word.
 */
const getGreeting = (string) => `hello ${string}`

export { getGreeting }
