import { JwtPayload } from 'jsonwebtoken';
import { IBrowser, ICPU, IDevice, IEngine, IOS } from 'ua-parser-js';

export interface UserAgent {
	browserName: IBrowser['name'];
	deviceType: IDevice['type'];
	deviceVendor: IDevice['vendor'];
	engineName: IEngine['name'];
	osName: IOS['name'];
	cpu: ICPU['architecture'];
}

export interface RefreshPayload extends JwtPayload {
	email: string;
	email_verified: boolean;
	userAgent: string;
}

export interface AccessPayload extends JwtPayload {
	email: string;
	email_verified: boolean;
}

export interface ActivationPayload extends JwtPayload {
	email: string;
}
