import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json'

export default [
  // CommonJS
  {
    input: 'src/main.js',
    output: { file: 'lib/r-list-model.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'prop-types',
    ],
    plugins: [babel(), resolve()]
  },

  // ES
  {
    input: 'src/main.js',
    output: { file: 'es/r-list-model.js', format: 'es', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'prop-types',
    ],
    plugins: [babel(), resolve()]
  }
]
