import { JwtPayload } from 'jsonwebtoken';
import { IBrowser, IDevice, IOS } from 'ua-parser-js';

export interface UserAgent {
	browser: IBrowser;
	os: IOS;
	device: IDevice;
}

export interface RefreshPayload extends JwtPayload {
	email: string;
	userAgent: string;
}

export interface AccessPayload extends JwtPayload {
	email: string;
}
