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
  },
]
