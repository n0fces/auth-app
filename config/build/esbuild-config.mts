import path from 'path';
import { BuildOptions } from 'esbuild';
import { startBuildPlugin } from './plugins/start-build-plugin';
import { clean } from 'esbuild-plugin-clean';

const dirname = import.meta.dirname;

const mode = process.env.MODE ?? 'development';
const vercel = process.env.VERCEL;
const isProd = mode === 'production';
const isDev = !isProd;

const resolveRoot = (...segments: string[]) =>
	path.resolve(dirname, '..', '..', ...segments);

const config: BuildOptions = {
	bundle: true,
	platform: 'node',
	minify: isProd,
	sourcemap: isDev,
	target: ['es2015'],
	format: 'cjs',
	tsconfig: resolveRoot('tsconfig.json'),
	outdir: vercel ? resolveRoot('api') : resolveRoot('build'),
	entryPoints: [resolveRoot('src', 'index.ts')],
	entryNames: isDev ? 'bundle' : 'index',
	plugins: [
		clean({
			patterns: ['build/*'],
			sync: true,
		}),
		startBuildPlugin,
	],
};

export default config;
