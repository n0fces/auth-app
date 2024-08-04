import { Plugin } from 'esbuild';

export const devMessagingPlugin: Plugin = {
	name: 'devMessagingPlugin',
	setup(build) {
		// Флаг для отслеживания ошибок
		let hasErrors = false;

		// Обработка ошибок во время сборки
		build.onEnd((result) => {
			if (result.errors.length > 0) {
				hasErrors = true;
				console.error('Build failed with errors.');
			} else if (hasErrors) {
				// Если ранее были ошибки, но теперь ошибок нет, выводим сообщение об успешной сборке
				console.log('Build succeeded ✅');
				hasErrors = false; // Сбрасываем флаг ошибок
			} else {
				console.log('Build succeeded ✅');
			}
		});
	},
};
