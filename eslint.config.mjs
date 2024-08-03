import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
	{
		name: 'general',
		ignores: ['node_modules/**/*', 'build/**/*'],
		...eslint.configs.recommended,
		languageOptions: { globals: globals.node },
	},
	{
		name: 'tseslint',
		languageOptions: {
			parserOptions: {
				project: ['tsconfig.json'],
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		files: ['src/**/*.{js,mjs,cjs,ts}', 'config/**/*.{js,mjs,cjs,ts}'],
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
