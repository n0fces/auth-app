import path from 'path';
import { BuildOptions } from 'esbuild';
import { startBuildPlugin } from './plugins/start-build-plugin';
import { clean } from 'esbuild-plugin-clean';

const dirname = import.meta.dirname;

const mode = process.env.MODE ?? 'development';
const isProd = mode === 'production';
const isDev = !isProd;

// хелпер для обращения к папкам относительно корня проекта
const resolveRoot = (...segments: string[]) =>
	path.resolve(dirname, '..', '..', ...segments);

const config: BuildOptions = {
	// включается встраиваение любых импортированных зависимсотей в сам файл сборки
	bundle: true,
	// сборка кода предназначена для выполнения в среде node js, а не browser, как стоит по умолчанию
	platform: 'node',
	// код минифицируется только под production-сборку
	minify: isProd,
	// включаение файлов sourcemap только для процесса разработки
	sourcemap: isDev,
	// указываем, что итоговая сборка транспилируется в JavaScript es2017
	target: ['es2017'],
	// файлы сборки будут использовать common js
	format: 'cjs',
	// указываем tsconfig.json, из которого будут браться настройки компиляции ts кода
	tsconfig: resolveRoot('tsconfig.json'),
	// для процесса разработки выходная директория будет temp, а для production сборки - build
	outdir: isProd ? resolveRoot('build') : resolveRoot('temp'),
	// указываем входную точку проекта
	entryPoints: [resolveRoot('src', 'index.ts')],
	// файл сборки для разработки будет называться bundle, для production-сборки - index
	entryNames: isDev ? 'bundle' : 'index',
	// массива для добавления плагинов
	plugins: [
		// плагин настроен таким образом, чтобы в dev режиме очищалась папка temp, а в production - build
		clean({
			patterns: [isDev ? 'temp/*' : 'build/*'],
			sync: true,
		}),
		// кастомный плагин, который сигнализирует о том, что сборка началась (неважно какая)
		startBuildPlugin,
	],
};

export default config;
