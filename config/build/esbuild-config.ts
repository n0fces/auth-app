import path from 'path';
import { BuildOptions } from 'esbuild';
// import { clearPlugin } from './plugins/clear-plugin';
import { startBuildPlugin } from './plugins/start-build-plugin';
import { clean } from 'esbuild-plugin-clean';

const dirname = import.meta.dirname;

const mode = process.env.MODE ?? 'development';
const isProd = mode === 'production';
const isDev = !isProd;

const resolveRoot = (...segments: string[]) =>
	path.resolve(dirname, '..', '..', ...segments);

const config: BuildOptions = {
	bundle: true,
	platform: 'node',
	minify: isProd,
	sourcemap: isDev,
	tsconfig: resolveRoot('tsconfig.json'),
	outdir: resolveRoot('build'),
	entryPoints: [resolveRoot('src', 'index.ts')],
	entryNames: '[dir]/bundle.[name]-[hash]',
	plugins: [
		clean({
			patterns: ['build/*'],
			sync: true,
		}),
		startBuildPlugin,
	],
};

export default config;
