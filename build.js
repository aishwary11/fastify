import { build } from 'esbuild';

build({
  entryPoints: ['src/server.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/bundle.cjs',
  platform: 'node',
  target: 'node16',
  format: 'cjs',
}).catch(() => process.exit(1));
