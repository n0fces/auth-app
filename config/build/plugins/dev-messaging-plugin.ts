import { Plugin } from 'esbuild';

export const devMessagingPlugin: Plugin = {
	name: 'devMessagingPlugin',
	setup(build) {
		let hasErrors = false;

		build.onEnd((result) => {
			if (result.errors.length > 0) {
				hasErrors = true;
				console.error('Build failed with errors.');
			} else if (hasErrors) {
				console.log('Build succeeded ✅');
				hasErrors = false;
			} else {
				console.log('Build succeeded ✅');
			}
		});
	},
};
