import esbuild from 'esbuild';
import config from './esbuild-config.mjs';
import { devMessagingPlugin } from './plugins/dev-messaging-plugin';

const ctx = await esbuild.context({
	...config,
	define: {
		'process.env.SERVER_URL': '"http://localhost:5000"',
		'process.env.CLIENT_URL': '"http://localhost:5173"',
	},
	plugins: config.plugins?.concat(devMessagingPlugin),
});

await ctx.watch();

ctx
	.serve({ host: 'localhost' })
	.then(({ host, port }) => {
		console.log(
			`Server is running on http://${host}:${String(port)}\nWe are ready to develop 🔥`,
		);
	})
	.catch((err: unknown) => {
		if (err instanceof Error) {
			console.log(`Something went wrong: ${err.message}`);
		}
		console.log("Something went wrong, and we don't understand what is it 😢");
	});
