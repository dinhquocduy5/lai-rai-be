import { Pool, type QueryConfig, type QueryResult, type QueryResultRow } from 'pg';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  ssl: false, // local
});

pool.on('connect', () => logger.info('✅ Connected to PostgreSQL (local)'));
pool.on('error', (err) => logger.error({ err }, '❌ Unexpected PG pool error'));

/** Overloads */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: any[],
): Promise<QueryResult<T>>;
export async function query<T extends QueryResultRow = QueryResultRow>(
  config: QueryConfig<any[]>,
): Promise<QueryResult<T>>;

/** Impl */
export async function query<T extends QueryResultRow = QueryResultRow>(
  textOrConfig: string | QueryConfig<any[]>,
  values?: any[],
): Promise<QueryResult<T>> {
  return typeof textOrConfig === 'string'
    ? pool.query<T>(textOrConfig, values)
    : pool.query<T>(textOrConfig);
}

export const db = { query };
