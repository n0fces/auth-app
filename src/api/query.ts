import {
	QueryConfig,
	QueryConfigValues,
	QueryResult,
	QueryResultRow,
} from 'pg';
import { pool } from '../db';

export const query = async <R extends QueryResultRow = any, I = any[]>(
	queryTextOrConfig: string | QueryConfig<I>,
	values?: QueryConfigValues<I>,
): Promise<QueryResult<R>> => {
	const cn = await pool.connect();
	try {
		const res = await cn.query(queryTextOrConfig, values);
		return res;
	} finally {
		cn.release();
	}
};
