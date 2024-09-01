import { build } from 'esbuild';

build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/bundle.cjs',
  color: true,
  sourcemap: false,
  platform: 'node',
  target: 'es2020',
  format: 'cjs',
}).catch(() => process.exit(1));
