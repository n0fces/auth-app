import esbuild from 'esbuild';
import config from './esbuild-config.mjs';

const result = await esbuild.build({
	...config,
	define: {
		'process.env.SERVER_URL': '"https://auth-app-brown-one.vercel.app"',
		'process.env.CLIENT_URL': '"https://auth-app-frontend-lac.vercel.app"',
		'process.env.IS_PROD': '"true"',
	},
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
