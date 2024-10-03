import { UserAgent } from 'types';
import UAParser from 'ua-parser-js';

/**
 * Функция для получения информации об User-Agent пользователя
 * Эта информация используется как один из параметров идентификации сессии
 * @param {string | undefined} userAgent - Берет строку User-Agent, которая приходит от клиента в заголовке для сервера
 * Этот заголовок содержит информацию о браузере клиента, девайсе, операционной системе и так далее.
 * @returns JSON строку, содержащую информацию об User-Agent пользователя
 */
export const getUA = (userAgent: string | undefined) => {
	const parser = new UAParser(userAgent);
	const ua: UserAgent = {
		browserName: parser.getBrowser().name,
		deviceType: parser.getDevice().type,
		deviceVendor: parser.getDevice().vendor,
		engineName: parser.getEngine().name,
		osName: parser.getOS().name,
		cpu: parser.getCPU().architecture,
	};
	return JSON.stringify(ua);
};
