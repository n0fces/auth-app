import { Plugin } from 'esbuild';

export const startBuildPlugin: Plugin = {
	name: 'startBuildPlugin',
	setup(build) {
		let hasStarted = false;
		build.onStart(() => {
			if (!hasStarted) {
				console.log('Building was started ⏳');
				hasStarted = true;
			}
		});
	},
};
