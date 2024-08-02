import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
	{
		ignores: ['node_modules/**/*', 'build/**/*'],
		...eslint.configs.recommended,
	},
	{
		name: 'tseslint',
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				project: ['tsconfig.json'],
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		files: ['src/**/*.{js,mjs,cjs,ts}'],
		extends: [
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
		],
	},
	{
		name: 'prettier',
		...eslintConfigPrettier,
		plugins: {
			eslintPluginPrettier,
		},
	},
);
