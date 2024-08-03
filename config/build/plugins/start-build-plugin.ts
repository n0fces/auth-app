import { Plugin } from 'esbuild';

export const startBuildPlugin: Plugin = {
	name: 'startBuildPlugin',
	setup(build) {
		build.onStart(() => {
			console.log('Building was started ⏳');
		});
	},
};
