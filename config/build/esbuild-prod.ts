import esbuild from 'esbuild';
import config from './esbuild-config';
import { startBuildPlugin } from './plugins/start-build-plugin';

const result = await esbuild.build({
	...config,
	plugins: config.plugins?.concat(startBuildPlugin),
	// define: {
	// 	'process.env.HOST': '"http://localhost"',
	// 	'process.env.PORT': '"5000"',
	// },
});

if (result.errors.length) {
	for (const err of result.errors) {
		console.log(`Error text: ${err.text}\n`);
		if (err.location) {
			const { file, namespace, line } = err.location;
			console.log(
				`File: ${file}\n`,
				`Namespace: ${namespace}`,
				`Line: ${String(line)}`,
			);
		}
	}
} else {
	console.log('Building was finished 🚀');
}
