import GeneratorBabel from '../../babel/index.js'
import GeneratorEslint from '../../eslint/index.js'
import GeneratorGit from '../../git/index.js'
import GeneratorHusky from '../../husky/index.js'
import GeneratorJest from '../../jest/index.js'
import GeneratorLintStaged from '../../lintstaged/index.js'
import GeneratorPrettier from '../../prettier/index.js'
import GeneratorTypeScript from '../../typescript/index.js'
import GeneratorCommitLint from '../../commitlint/index.js'
import GeneratorLicense from 'generator-license/app/index.js'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export class GeneratorProvider {
  getGitGenerator() {
    return {
      Generator: GeneratorGit,
      path: require.resolve('../../git'),
    }
  }

  getHuskyGenerator() {
    return {
      Generator: GeneratorHusky,
      path: require.resolve('../../husky'),
    }
  }

  getEslintGenerator() {
    return {
      Generator: GeneratorEslint,
      path: require.resolve('../../eslint'),
    }
  }

  getPrettierGenerator() {
    return {
      Generator: GeneratorPrettier,
      path: require.resolve('../../prettier'),
    }
  }

  getLintStagedGenerator() {
    return {
      Generator: GeneratorLintStaged,
      path: require.resolve('../../lintstaged'),
    }
  }

  getTypeScriptGenerator() {
    return {
      Generator: GeneratorTypeScript,
      path: require.resolve('../../typescript'),
    }
  }

  getBabelGenerator() {
    return {
      Generator: GeneratorBabel,
      path: require.resolve('../../babel'),
    }
  }

  getJestGenerator() {
    return {
      Generator: GeneratorJest,
      path: require.resolve('../../jest'),
    }
  }

  getCommitLintGenerator() {
    return {
      Generator: GeneratorCommitLint,
      path: require.resolve('../../commitlint'),
    }
  }

  getLicenseGenerator() {
    return {
      Generator: GeneratorLicense,
      path: require.resolve('generator-license/app'),
    }
  }
}
