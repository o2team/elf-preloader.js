import babel from 'rollup-plugin-babel'
import pkg from './package.json'

export default [
  {
    input: 'src/preloader.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      {
        file: pkg.browser,
        format: 'umd',
        name: 'Preloader',
      },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
]
