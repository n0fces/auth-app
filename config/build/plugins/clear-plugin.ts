import { Plugin } from 'esbuild';
import { rm } from 'fs/promises';

export const clearPlugin: Plugin = {
	name: 'clearPlugin',
	setup(build) {
		build.onStart(async () => {
			try {
				const outdir = build.initialOptions.outdir;
				if (outdir) {
					await rm(outdir, { recursive: true });
				}
			} catch (error: unknown) {
				console.log('Error occurred while cleaning the build folder');
				if (error instanceof Error) {
					console.log(error.message);
				}
			}
		});
	},
};
