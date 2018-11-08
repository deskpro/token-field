import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import cssnext from 'postcss-cssnext';
import simplevars from 'postcss-simple-vars';
import postcssModulesValues from 'postcss-modules-values';

module.exports = {
  input:  'src/Components/index.js',
  output: {
    file:      'dist/index.js',
    format:    'umd',
    name:      'tokenField',
    sourcemap: true,
    globals:   {
      react:       'React',
      'react-dom': 'ReactDOM'
    },
    exports: 'named'
  },
  plugins: [
    postcss({
      parser:  false,
      plugins: [
        simplevars(),
        cssnext(),
        postcssModulesValues
      ],
      modules:    true,
      extensions: ['.css']
    }),
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs({
      // exclude: ['node_modules/@deskpro/react-components/**'],
      namedExports: {
        'node_modules/@deskpro/react-components/dist/index.js': [
          'Checkbox',
          'Datepicker',
          'Icon',
          'Input',
          'Label',
          'List',
          'ListElement',
          'Section',
          'Scrollbar',
          'Tabs',
          'TabLink',
        ]
      }
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
  ],
  external: ['react', 'react-dom']
};
