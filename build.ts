import { build } from 'esbuild';

const buildConfig = {
  entryPoints: ['src/server.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/bundle.cjs',
  color: true,
  sourcemap: false,
  platform: 'node' as const,
  target: 'es2020',
  format: 'cjs' as const,
  external: ['mongoose', 'fastify'],
};

try {
  await build(buildConfig);
} catch {
  process.exit(1);
}
