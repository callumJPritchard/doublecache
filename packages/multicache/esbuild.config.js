const esbuild = require('esbuild')
const pnpPlugin = require('@yarnpkg/esbuild-plugin-pnp')
// Automatically exclude all node_modules from the bundled version
//const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild.build({
  entryPoints: ['./dist/index.js'],
  outfile: 'dist/index.js',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: true,
  target: 'node14',
  //overwrite: true,
  plugins: [pnpPlugin.pnpPlugin()]
  //plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1))