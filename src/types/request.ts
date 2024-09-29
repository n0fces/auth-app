import { Request } from 'express';

interface ReqBody {
	email?: string;
	password?: string;
	token?: string;
	logoutAllDevices?: string;
}

interface ReqParams {
	link?: string;
	token?: string;
}

export type AppRequest = Request<ReqParams, object, ReqBody>;
