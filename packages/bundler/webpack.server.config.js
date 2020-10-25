const pickBy = require('lodash/pickBy')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const PROD = !process.env.WEBPACK_DEV
const BUILD_DIR = '/build/'
const BUILD_PATH = path.join(process.cwd(), BUILD_DIR)

const EXTENSIONS = ['.server.js', '.server.jsx', '.server.ts', '.server.tsx', '.server.cjs', '.server.mjs', '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json']

const DEFAULT_FORCE_COMPILE_MODULES = [
  '@startupjs/init',
  '@startupjs/init/server',
  'startupjs/init',
  'startupjs/init/server',
  '@startupjs/app',
  '@startupjs/app/server',
  'startupjs/app',
  'startupjs/app/server',
  '@startupjs/orm',
  'startupjs/orm',
  'startupjs/server',
  '@startupjs/docs'
]
const DEFAULT_ALIAS = {
}

module.exports = function getConfig (env, {
  forceCompileModules = [],
  modulesDir = 'node_modules',
  alias = {}
} = {}) {
  process.env.BABEL_ENV = 'server'

  if (typeof forceCompileModules === 'string') {
    forceCompileModules = JSON.parse(forceCompileModules)
  }
  if (typeof alias === 'string') {
    alias = JSON.parse(alias)
  }
  forceCompileModules = forceCompileModules.concat(DEFAULT_FORCE_COMPILE_MODULES)
  forceCompileModules = forceCompileModules.map(moduleName => {
    return new RegExp('^' + moduleName + '($|/)')
  })
  return pickBy({
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals({
      modulesDir,
      whitelist: forceCompileModules
    })], // in order to ignore all modules in node_modules folder
    mode: PROD ? 'production' : 'development',
    devtool: 'source-map',
    entry: {
      server: ['@babel/polyfill', './server.js']
    },
    plugins: [
      new ProgressBarPlugin({
        format: '\u001b[1m\u001b[32m:percent\u001b[0m (:elapsed seconds)'
      })
    ],
    output: {
      path: BUILD_PATH,
      filename: PROD ? '[name].cjs' : '[name].dev.cjs'
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      extensions: EXTENSIONS,
      alias: {
        ...DEFAULT_ALIAS,
        ...alias
      }
    }
  }, Boolean)
}
