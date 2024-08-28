import { UserAgent } from 'types';
import UAParser from 'ua-parser-js';

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
