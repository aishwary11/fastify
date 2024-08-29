import { build } from 'esbuild';

build({
  entryPoints: ['server.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/bundle.js',
  platform: 'node',
  target: 'node16',
  format: 'esm',
}).catch(() => process.exit(1));
