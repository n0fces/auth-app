import { UserAgent } from 'types';
import UAParser from 'ua-parser-js';

export const getUA = (userAgent: string | undefined) => {
	const parser = new UAParser(userAgent);
	const ua: UserAgent = {
		browser: parser.getBrowser(),
		os: parser.getOS(),
		device: parser.getDevice(),
	};
	return JSON.stringify(ua);
};
