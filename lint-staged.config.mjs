export default {
	'src/**/*': () => ['prettier --write --ignore-unknown', 'eslint'],
	'config/**/*': () => ['prettier --write --ignore-unknown', 'eslint'],
};
