import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';

export default tseslint.config(
	// * глобально игнорируемые директории
	// * https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
	{
		ignores: [
			'node_modules/**/*',
			'build/**/*',
			'.husky/**/*',
			'.env',
			'.gitignore',
			'.prettierignore',
			'*.txt',
			'*.config.*',
		],
	},
	{
		name: 'general',
		languageOptions: {
			parser: tsParser,
			globals: globals.node,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
			// Отключает все правила, которые не нужны или могут конфликтовать с Prettier
			eslintConfigPrettier,
		],
	},
	{
		files: ['**/*.js'],
		...tseslint.configs.disableTypeChecked,
	},
	{
		files: ['src/routes/index.ts'],
		rules: {
			// в коде приложения есть app.use(errorMiddleware), который перехватывает все ошибки
			'@typescript-eslint/no-misused-promises': 'off',
			// в коде контроллеров и моделей нигде не используются контекст извне
			'@typescript-eslint/unbound-method': 'off',
		},
	},
	{
		name: 'overrides',
		files: ['src/api/query.ts', 'types.d.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
);
