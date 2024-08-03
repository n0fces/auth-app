export default {
	'src/**/*': () => ['prettier --write', 'eslint'],
	'config/**/*': () => ['prettier --write', 'eslint'],
};
