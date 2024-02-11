# Release notes

**Features added in version 1.0.0:**

- Generator-esmodules-generator is tested with **node >= 18.17.0 and node 20.x in the latest version of Ubuntu.**
- Fixed: Problem with verified generator name.
- In tests folder: The withPrompts method is replaced by withAnswers method.
- Generator-esmodules-generator receives terminal arguments and options. Example:

  ```yo generator-esmodules-generator generator_test --license=MIT```

- The question 'Project's name' (generator name) was deleted. Now Project's name is a terminal argument. Example:

  ```yo generator-esmodules-generator generator_name```
  
- If you want to use only terminal, you should use the option --onlyTerminal. This option avoid use the yeoman prompt. Example:

  ```yo generator-esmodules-generator generator_test --onlyTerminal```

**Features added in version 0.2.0:**

- The generator name is verified. The prefix generator- is added automatically to the generator name.
- The keyword 'yeoman-generator' is added automatically in package.json.
- The generator created by generator-esmodules-generator contains the version 0.1.0 in package.json.
